from flask import Flask, render_template, request, jsonify, send_file
import openai
import os
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import json
from langchain.utils.math import cosine_similarity
import networkx as nx
import matplotlib.pyplot as plt

# from flask_socketio import SocketIO, emit

#currently we can apply our own key, but later need to public this to let user to put their own key
#defining api key
API_SECRET_KEY = 'censored'
BASE_URL = 'censored'
os.environ["OPENAI_API_KEY"] = API_SECRET_KEY
os.environ["OPENAI_API_BASE"] = BASE_URL
#-----
#defining model
model = ChatOpenAI(model="gpt-3.5-turbo", verbose=True)
#-----


input_variables_list = []
input_variables_demonstration = []
worldsetting_list = []
character_list = []
narrator_behavior_list = []

variable_dic = {}

#for page2 card creation
worldsetting_list_no = 0
character_list_no = 0
narrator_behavior_list_no = 0
input_variables_list_no = 0



#***for defining the dictionary output, what we will use in the real narrative-- page2
narrating_dic = {}

#----
#this should not be changes, is for summarizing the chat history -- page3
contextualize_q_system_prompt = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""

chat_history = []

#for switching stages
stage = "initial narrative stage"

#------


#oringinal
player_input = ""
external_input = ""
ai_output = ""

string_chat_history = ""

G = nx.DiGraph({})
P = nx.spring_layout(G)

class RunnableParallel:
    def __init__(self, items):
        self.items = items

    def add_item(self, key, value):
        self.items[key] = value


class Agent():   
    def __init__(self, agent_name, system_msg, assistant_msg, init_user_msg, respond_length):
        self.agent_name = agent_name
        self.system_msg = system_msg
        self.assistant_msg = assistant_msg
        self.init_user_msg = init_user_msg
        self.respond_length = respond_length
        self.messages = [{"role": "assistant", "content": assistant_msg},
                         {"role": "user", "content": init_user_msg}]
        self.debug_mode = False 

    def get_completion(self, model="gpt-3.5-turbo", temperature=0.8):
        #global total_tokens
        messages = self.messages
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=temperature
        )
        self.messages.append({"role": "assistant", "content": response.choices[0].message["content"]})
        self.total_tokens = response.usage["total_tokens"]
        #print("Total tokens:", total_tokens)

        if self.debug_mode:
            #return response
            return messages
        else:
            return response.choices[0].message["content"]
narrator = Agent("narrator", 
                      '',
                      "Hi, I'm the narrator.", 
                      '', 
                      "30")


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

#---for page1
@app.route('/world', methods=['POST', 'GET'])
def system():
    global worldsetting_list
    global character_list
    global input_variables_list 
    global input_variables_demonstration
    global variable_dic

    global narrator_behavior_list
    global newkey

    input_data = request.json
    if input_data['id'] == 1:
        worldsetting_list.append(input_data['text'])
        print(worldsetting_list)  # Printing the result on the server console
        
    elif input_data['id'] == 2:
        character_list.append(input_data['text'])
        print(character_list)  

    elif input_data['id'] == 5:
        narrator_behavior_list.append(input_data['text'])
        print(narrator_behavior_list)  
    

    #create a dictionary to store the variable and description
    elif input_data['id'] == 3:
       #modified
       input_variables_list.append(input_data['text'])
       print(input_variables_list )  
       newkey= input_data['text']

    elif input_data['id'] == 4:
       input_variables_demonstration.append(input_data['text'])
       print(input_variables_demonstration)  
       newkeyvalue= input_data['text']

       variable_dic[newkey] = newkeyvalue
       print(variable_dic)  # Printing the result on the server console
    elif input_data['id'] == 6:
       narrating_dic[input_data['text']] = {'systemprompt':[], 'retrieval':[], 'externalinput':[]}
    
    return jsonify({'output': ''})


@app.route('/removeworld', methods=['POST'])
def removesystem():
    global worldsetting_list
    global character_list
    global input_variables_list 
    global input_variables_demonstration
    global variable_dic
    global narrator_behavior_list

    data = request.json
    number_change = 0
    if data['id'] == 1:
     if data['value'] in worldsetting_list:
        worldsetting_list.remove(data['value'])
        number_change = len(worldsetting_list)
        print(worldsetting_list)
     else:
        print(f"{data['value']} no existi")
        
    elif data['id'] == 2:
        character_list.remove(data['value'])
        number_change = len(character_list)
        print(character_list)  # Printing the result on the server console

    elif data['id'] == 5:
        narrator_behavior_list.remove(data['value'])
        number_change = len(narrator_behavior_list)
        print(narrator_behavior_list)  


    elif data['id'] == 3:
        del variable_dic[data['value']]
        input_variables_list.remove(data['value'])
        number_change = len(input_variables_list)
        print(input_variables_list)
        print(variable_dic) # Printing the result on the server console
    elif data['id'] == 4:
       input_variables_demonstration.remove(data['value'])
       variable_dic[data['key']] = "This variable's description is undefined." 
       print(input_variables_demonstration)
       print(variable_dic)
    # Send the result to the client-side JavaScript as a JSON response
    return jsonify({'output': number_change})


@app.route('/worldcard')
def get_data1():
    global worldsetting_list
    global worldsetting_list_no
    worldsetting_list_no = len(worldsetting_list)
    print("wordcardno", worldsetting_list_no)
    data = {'value': worldsetting_list_no, 'textlist': worldsetting_list}
    return jsonify(data)


@app.route('/charactercard')
def get_data2():
    global character_list
    global character_list_no
    character_list_no = len(character_list)
    print("charactercardno", character_list_no)
    data = {'value': character_list_no, 'textlist': character_list}
    return jsonify(data)


@app.route('/narratorcard')
def get_data3():
    global narrator_behavior_list
    global narrator_behavior_list_no
    narrator_behavior_list_no = len(narrator_behavior_list)
    #print("narratorno", narrator_behavior_list_no)
    data = {'value': narrator_behavior_list_no, 'textlist': narrator_behavior_list}
    return jsonify(data)

@app.route('/inputcard')
def get_data4():
    global variable_dic
    global input_variables_list_no
    global input_variables_demonstration
    input_variables_list_no = len(variable_dic)
    #print("inputno", input_variables_list_no)
    data = {'value': input_variables_list_no, 'textlist': input_variables_demonstration}
    return jsonify(data)

@app.route('/update_stage', methods=['POST'])
def update_stage():
    data = request.json
    prompt_must_have = "This is the story context you are based from:{context} \ generate narrative based on player's input: {question}. " 

    card_id_words = data['card_id'].split(' ')
    if card_id_words[0] =='worldcard':
        append_data = worldsetting_list[int(card_id_words[-1])-1]
        narrating_dic[data['stage_id'] ]['retrieval'].append(append_data)

    elif card_id_words[0] =='charactercard':
        append_data = character_list[int(card_id_words[-1])-1]
        narrating_dic[data['stage_id'] ]['retrieval'].append(append_data)

    elif card_id_words[0] =='narratorcard':
        append_data = narrator_behavior_list[int(card_id_words[-1])-1]+prompt_must_have
        narrating_dic[data['stage_id'] ]['systemprompt'].append(append_data)

    elif card_id_words[0] =='inputcard':
        append_data = "{"+input_variables_list[int(card_id_words[-1])-1]+"}."+input_variables_demonstration[int(card_id_words[-1])-1]
        narrating_dic[data['stage_id'] ]['systemprompt'].append(append_data)
        narrating_dic[data['stage_id'] ]['externalinput'].append(input_variables_list[int(card_id_words[-1])-1])

    print(data['stage_id'], data['card_id'])
    print(narrating_dic)
    return jsonify(data)


#---for page2

# @app.route('/branching', methods=['POST', 'GET'])
# TO DO @Warren: This route should be used to update the narrating_dic dictionary
#here is for building a dictionary to store the systemprompt and the retrievel list
# @app.route('/branching', methods=['POST', 'GET'])
#global narrating_dic
#narrating_dic["initial narrative stage"]={"systemprompt": narrator_behavior_list[0] + input_variables_list[0]+input_variables_demonstration[0], "retrieval": worldsetting_list[0]+character_list[0]}
#key是根据html里接受的string来设置的, SYSTEMPROMPT是当前输入的behavior和inputvariable的拼贴, RETRIEVAL是当前输入的worldsetting和character的拼贴



# Ideally, the outcome of this route is updating narrating_dic = {}




#---for page3

@app.route('/process', methods=['POST', 'GET'])
def process():
     
     global narrating_dic 
     global player_input
     global external_input
     global start
     global ai_output

     input_data = request.json

     if input_data['id'] == 1:
        player_input = input_data['text']
        print("playerinput", player_input)  
        start = ""       
     elif input_data['id'] == 2:
        external_input = input_data['text']
        print("externalinput", external_input)  
        start = ""
     elif input_data['id'] == 5:
        start = input_data['text']
        print("start", start)  
     else:
        start = ""


     
     #for demo, the real one will be updated in real time
     #need to solve how to automatically add "{}" for input variable

     merged_narrating_dic = {}

     for stage, data in narrating_dic.items():
            merged_data = {}
            for key, value in data.items():
                merged_data[key] = ' '.join(value)
            merged_narrating_dic[stage] = merged_data

     print(merged_narrating_dic)

    #  narrating_dic = {"initial narrative stage": {"systemprompt": prompt_must_have + narrator_behavior_list[0] + "{"+input_variables_list[0]+"}"+input_variables_demonstration[0], 
    #                                        "retrieval": worldsetting_list[0]+character_list[0], "externalinput": input_variables_list[0]},

    #                    "stage2": {"systemprompt": prompt_must_have + narrator_behavior_list[1] + "{"+ input_variables_list[1]+"}"+input_variables_demonstration[1],
    #                                        "retrieval": worldsetting_list[1]+character_list[1], "externalinput": input_variables_list[1]},

    #                    "stage3": {"systemprompt": prompt_must_have + narrator_behavior_list[2] + "{"+ input_variables_list[2]+ "}"+input_variables_demonstration[2],
    #                                        "retrieval": worldsetting_list[2]+character_list[2], "externalinput": input_variables_list[2]},

    #                    "stage4": {"systemprompt": prompt_must_have + narrator_behavior_list[2] + "{"+ input_variables_list[2]+ "}"+input_variables_demonstration[2],
    #                                        "retrieval": worldsetting_list[2]+character_list[2], "externalinput": input_variables_list[2]}

    #                  }
     
     dic= {
            "Stage1": {"Stage1":"stay the same, looks like it is going to continue the conversation", "Stage2": "The condition for judge: when water is mentioned", "Stage3":"The condition for judge: when banana is mentioned", "stage4":"The condition for judge: when apple is mentioned"},
            "Stage2": {"Stage3": "when banana is mentioned"},
            "Stage3": {"Stage2": "when water is mentioned"},
            "Stage4": {"initial narrative stage": "price tag is mentioned"},
      }
        
     
#start
     if start == "generate":   
 #--------------
        global string_chat_history

        vectorstore = DocArrayInMemorySearch.from_texts(
                    # narrating_dic["initial narrative stage"]["retrieval"],
                    merged_narrating_dic[stage]["retrieval"],
                    embedding=OpenAIEmbeddings(),
                    ) 
        
        retriever = vectorstore.as_retriever()
        
        
        contextualize_q_prompt = ChatPromptTemplate.from_messages(
                    [
                    ("system", contextualize_q_system_prompt),
                    MessagesPlaceholder(variable_name="chat_history"),
                    ("human", "{question}"),
                    ]
                )
        contextualize_q_chain = contextualize_q_prompt | model | StrOutputParser()
        print("systemprompt", merged_narrating_dic[stage]["systemprompt"])  

        prompt = ChatPromptTemplate.from_messages(
                    [
                    ("system", merged_narrating_dic[stage]["systemprompt"]),
                    MessagesPlaceholder(variable_name="chat_history"),
                    ("human", "{question}"),
                    ]
                )


        def contextualized_question(input: dict):
                    if input.get("chat_history"):
                        return contextualize_q_chain
                    else:
                        return input["question"]
                    
        setup_and_retrieval = RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
        # setup_and_retrieval.add_item(input_variables_list[0], RunnablePassthrough())
        setup_and_retrieval.add_item(merged_narrating_dic[stage]["externalinput"], RunnablePassthrough())

        print("externalinput", merged_narrating_dic[stage]["externalinput"])

        rag_chain = (
                    RunnablePassthrough.assign(
                    context=contextualized_question | retriever 
                )
                    | prompt
                    | model
                )
        

        invoke_dict = {"question": player_input, "chat_history": chat_history}
        invoke_dict[merged_narrating_dic[stage]["externalinput"]] = external_input        
           
        ai_msg = rag_chain.invoke(invoke_dict)
        chat_history.extend([HumanMessage(content=player_input), AIMessage(content=ai_msg.content)])
        print("narrative:", ai_msg.content)
        ai_output = ai_msg.content

        string_chat_history = '\n'.join(str(msg) for msg in chat_history)
        print("chat history:", string_chat_history)
        
    #  datasend = {'playerinput': player_input, 'aioutput': ai_output}
     datasend = {'aioutput': ai_output}
     
     #--------------condition judging
     real_dictionary = dic[stage]
     dictionary_list = list(real_dictionary.items())
     print(dictionary_list)
     print(len(dictionary_list))

     embeddings = OpenAIEmbeddings()
     prompt_templates = [item[1] for item in dictionary_list]
     prompt_embeddings = embeddings.embed_documents(prompt_templates)

    

     def prompt_router(user_input):
                    
                    if user_input == "":
                        return None  

                    global stage 
                    query_embedding = embeddings.embed_query(user_input)
                    similarity = cosine_similarity([query_embedding], prompt_embeddings)[0]
                    most_similar = prompt_templates[similarity.argmax()]
                    print(similarity)
                    print(most_similar)

                    for template in dictionary_list:
                     if template[1] == most_similar:
                        label = template[0]
                        break
                    print(label)  
                    stage = label
                    return stage
                # return PromptTemplate.from_template(label)
                
     print(prompt_router(string_chat_history))

     return jsonify(datasend)



@app.route('/updatenarrative')
def get_data5():
    global ai_output
    data = {'value': ai_output}
    return jsonify(data)
        
@app.route('/reset', methods=['POST'])
def reset():
    global worldsetting_list
    global character_list
    global input_variables_list 
    global input_variables_demonstration
    global narrator_behavior_list
    global variable_dic
    global narrating_dic
    worldsetting_list = []
    character_list = []
    input_variables_list = []
    input_variables_demonstration = []
    narrator_behavior_list = []
    variable_dic = {}
    narrating_dic = {}
    G.clear()
    return jsonify({'output': ''})
what_stage_pink = []
@app.route('/set_img', methods=['POST'])
def set_image():
    global what_stage_pink
    input_data = request.json  # Get the JSON data from the request
    # Perform operations with the received data
    # For demonstration purposes, let's just print the received dictionary
    print(input_data)
    def draw(input_data,what_stage_pink ):
        G = 0
        G = nx.DiGraph(input_data)
        for layer, nodes in enumerate(nx.topological_generations(G)):
        # `multipartite_layout` expects the layer as a node attribute, so add the
        # numeric layer value as a node attribute
            for node in nodes:
                G.nodes[node]["layer"] = layer
        P = nx.multipartite_layout(G, subset_key="layer")
        node_colors = ["pink" if node in what_stage_pink else "lightblue" for node in G.nodes]
        nx.draw_networkx(G, pos=P, node_color=node_colors)
        plt.savefig("static\scan.jpg")
        G.clear()
        plt.clf()
    draw(input_data, what_stage_pink)
    # Return a JSON response (optional)
    return send_file("static\scan.jpg", mimetype='image/jpeg')
    
@app.route('/set_pink', methods=['POST'])
def set_pink():
    global what_stage_pink
    input_data = request.json
    
    what_stage_pink = input_data["pink"]
    print(what_stage_pink)
    return jsonify({'output': ''})


if __name__ == '__main__':
    app.run(debug=True)