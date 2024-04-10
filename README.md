
The link to website: https://ainarrator.pythonanywhere.com/    (Several function don't work in the website. For full experience, please run it locally.)

# About the website
This website allow users to create various setting of the stroyworld, making plot on it and then pass it to chatbot to generate stories.

# Page1
In this page, user can type setting of the world. World setting controls the background knowledge of the world. Character setting let users create the character. Narrator setting let user control the role of the chatbot. Input variable sets the parameter of the storyworld. See image below for demonstration. 
![alt text](https://github.com/warrenwong641/AInarrator/blob/0b2ae84ef145da559305dd613347c99cb077ebf4/page1.png)

# Page2
User can find draggabl world setting, character, narrator and input variable cards initialize there. By pressing the add stage button, a black, indexed, draggable box will be created and users can drag cards into the box. Pressing the pink button and then press another stage box, a link will a '+' button will link these two box. Double clicking the plus sign will show a pop up window so that users can type the switching conditions between the stages. For example, user can type:" If the word food is generated, the switch start.". 
![alt text](https://github.com/warrenwong641/AInarrator/blob/0b2ae84ef145da559305dd613347c99cb077ebf4/page2.png)


# Page3
From left to right, the typing bar on the left is the place for users type the command to the chatbot. Next, is the typing bar controlling the value of input variables that you define at page 1. The third section is to show the outupt of the chatbot. The picture on the right is the direct graph of the stages. Nodes and edges are structure just like how users defined at page 2. Pink node represents the stage we have explored. 
![alt text](https://github.com/warrenwong641/AInarrator/blob/0b2ae84ef145da559305dd613347c99cb077ebf4/page3.png)

# Running on local machine
Download all the file and then place them on a same directory. On terimal, set cd to the directory. Next, type python app.py.

