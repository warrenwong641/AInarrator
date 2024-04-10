



$(document).ready(function(){
  $('#next_button, #world_button, #narrator_button, #character_button, #variable_button').click(function(){

     $.ajax({
      url: '/worldcard',
      type: 'GET',
      dataType: 'json',
      success: function(data){
          $('#worldcard').text(data.value);
          // $('#worldcontent').text(data.worldlist);
          createDraggableCards(data.value, 'worldcard', '#FF69B4', data.textlist); 
      }
     });
  

      $.ajax({
          url: '/charactercard',
          type: 'GET',
          dataType: 'json',
          success: function(data){
              $('#charactercard').text(data.value);
              // $('#charactercontent').text(data.characterlist);
              createDraggableCards(data.value, 'charactercard', '#3CB371', data.textlist); 
          }
      });

      $.ajax({
          url: '/narratorcard',
          type: 'GET',
          dataType: 'json',
          success: function(data){
              $('#narratorcard').text(data.value);
              // $('#narratorcontent').text(data.narratorlist);
              createDraggableCards(data.value, 'narratorcard', '#FFB6C1', data.textlist); 
          }
      });

      $.ajax({
          url: '/inputcard',
          type: 'GET',
          dataType: 'json',
          success: function(data){
              $('#inputcard').text(data.value);
              // $('#inputcontent').text(data.inputlist);
              createDraggableCards(data.value, 'inputcard', '#FFA500', data.textlist); 
          }
      });

  });  
});



// page1

var worldsettingList =[
  "Enchanted Forest: A mystical forest shrouded in enchantment, with towering ancient trees, sparkling streams, and glowing flora. Sunlight filters through the dense canopy, casting ethereal hues across the landscape. Magical creatures roam freely, and whispers of forgotten spells fill the air.",
  "A bustling metropolis of gleaming skyscrapers, advanced technology, and neon lights. Flying cars zip through the skies, holographic advertisements dance on every corner, and automated drones navigate the cityscape. The atmosphere hums with energy and innovation.",
   "Decaying ruins of a long-lost civilization, nestled deep within an overgrown jungle. Crumbling stone structures, intricate carvings, and moss-covered artifacts tell tales of a forgotten era. The air is heavy with mystery and echoes of the past."
  ]
  
var characterList =[
"Luna: Luna is a wise and mysterious sorceress with long flowing robes and a staff adorned with glowing crystals. She possesses ancient knowledge and a calm demeanor. Her eyes sparkle with hidden powers, and her words resonate with wisdom and guidance.",
"Max: Max is a curious and adventurous young explorer. He wears a weathered hat, a tattered explorer's jacket, and carries a map and compass. With a mischievous grin, he embodies the spirit of a fearless adventurer, always seeking new discoveries and thrills.",
"Aurora: Aurora is a kind-hearted and compassionate fairy with shimmering wings and a radiant aura. She spreads joy and healing with her gentle touch and soothing voice. Her presence brings a sense of tranquility and hope to those around her."
]
  
var narratorList = [
  "Descriptive: The narrator provides vivid descriptions of the surroundings, characters, and events, painting a detailed picture for the audience. They engage the audience's senses by describing sights, sounds, smells, and textures.",
  "Engaging: The narrator uses a dynamic and expressive tone, capturing the audience's attention and creating a sense of excitement. They employ rhetorical questions, exclamations, and varying pacing to keep the audience engaged and interested.",
  "Reflective: The narrator offers introspective and contemplative insights, delving into the characters' thoughts and emotions. They provide commentary on the themes and deeper meanings of the story, encouraging the audience to reflect on the narrative's messages."
  ]
  
var variableList =[
    "darkmatter",
    "lightinstensity",
    "water"
  ]

var variableDesList =[
    "denoted by 1-10, more darkmatter, the story becomes more mysterious",
    "denoted by 1-10, more light intensity, the story becomes more bright and hopeful",
    "a boolean variable, if water is present, the story will mentioned water"
  ]

var currentIndex = 0;  

function populateInputFields() {
 
  if (currentIndex < 4) {
    var currentworld = worldsettingList[currentIndex];
    var currentcharacter = characterList[currentIndex];
    var currentnarrator = narratorList[currentIndex];
    var currentvariable = variableList[currentIndex];
    var currentvariabledes = variableDesList[currentIndex];

    document.getElementById("typing-bar_world-1").value = currentworld;
    document.getElementById("typing-bar_world-2").value = currentcharacter;
    document.getElementById("typing-bar_world-5").value = currentnarrator;
    document.getElementById("typing-bar_world-3").value = currentvariable;
    document.getElementById("typing-bar_world-4").value = currentvariabledes;
    currentIndex++;  
  }
}

function updateworld(barNumber) {
  // added

  const typingBar = document.getElementById(`typing-bar_world-${barNumber}`);
  const output = document.getElementById(`output-world-${barNumber}`);

  const entry = document.createElement("div");
  entry.className = "entry";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "−";
  entry.appendChild(deleteButton);

  const entryText = document.createElement("span");
  entryText.innerHTML = typingBar.value;
  entry.appendChild(entryText);

  deleteButton.onclick = function () {
    entry.remove();

 fetch('/removeworld', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value:entryText.innerHTML, id:barNumber  })
  })
    .then(response => response.json())
    .then(data => {
      if (barNumber === 1) {
        $('#worldcard').text(data.output);

      } else if (barNumber === 2) {
        $('#charactercard').text(data.output);
      } else if (barNumber === 5) {
        $('#narratorcard').text(data.output);
    }
  });
  };
  

  output.appendChild(entry);

  // Send input data to the Python server
  fetch('/world', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: typingBar.value , id:barNumber})
  })
    .then(response => response.json())
    .then(data => {
      
    });

  typingBar.value = "";
}



function updatevariable(barNumberVariable) {
  // function updateworld(barNumber) {
    // added
    const typingBar = document.getElementById(`typing-bar_world-${barNumberVariable}`);
    const typingBar2 = document.getElementById(`typing-bar_world-${barNumberVariable+1}`);
    const output = document.getElementById(`output-world-${barNumberVariable}`);
    const output2 = document.getElementById(`output-world-${barNumberVariable+1}`);

  
    const entry = document.createElement("div");
    entry.className = "entry";
  
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = "−";
    entry.appendChild(deleteButton);
  
    const entryText = document.createElement("span");
    entryText.innerHTML = typingBar.value;
    entry.appendChild(entryText);
    output.appendChild(entry);
    const entry2 = document.createElement("div");
    entry2.className = "entry";
  
    const deleteButton2 = document.createElement("button");
    deleteButton2.className = "delete-button";
    deleteButton2.innerHTML = "−";
    entry2.appendChild(deleteButton2);
  
    const entryText2 = document.createElement("span");
    entryText2.innerHTML = typingBar2.value;
    entry2.appendChild(entryText2);
    output2.appendChild(entry2);
    
    deleteButton.onclick = function () {
      entry.remove();

      entry2.remove();
      // 发送删除请求给服务器（如果需要）
      fetch('/removeworld', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: entryText2.innerHTML, id: barNumberVariable+1, key: entryText.innerHTML })
      })
        .then(response => response.json())
        .then(data => {
          // 处理返回的数据（如果需要）
        });
  
  
      fetch('/removeworld', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value:entryText.innerHTML, id:barNumberVariable})
        })
          .then(response => response.json())
          .then(data => {
              $('#inputcard').text(data.output);
          });
    };
    deleteButton2.onclick = function () {

      entry2.remove();
      // 发送删除请求给服务器（如果需要）
      fetch('/removeworld', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: entryText2.innerHTML, id: barNumberVariable+1, key: entryText.innerHTML })
      })
        .then(response => response.json())
        .then(data => {
          // 处理返回的数据（如果需要）
        });
    };
  
    // Send input data to the Python server
    fetch('/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: typingBar.value , id:barNumberVariable})
    })
      .then(response => response.json())
      .then(data => {
        
      });
    fetch('/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: typingBar2.value , id:barNumberVariable+1})
    })
      .then(response => response.json())
      .then(data => {
        
      });
    typingBar.value = "";
    typingBar2.value = "";
  }



//page2

function createDraggableCards(cardCount, cardType, color, textlist) {
  var cardContainer = $('#' + cardType + 'Container');
  var textContainer = $('#textContainer');
  cardContainer.empty(); // 清空容器中的内容

  for (var i = 1; i <= cardCount; i++) {
      var card = $('<div class="draggable-card">' + cardType + ' Card ' + i + '</div>');
      card.css('background-color', color); // 设置背景颜色
      card.draggable(); // 添加可拖动功能
      card.data('index', i-1); // 将索引存储在卡片的数据中
      card.click(function() {
        var index = $(this).data('index'); // 获取卡片的索引
        var cardText = textlist[index]; // 根据索引获取对应的文本
        textContainer.text("details:"+ cardText); // 在textContainer中显示文本
      });
      card.mouseup(function(event) {
        var pos3 = event.clientX;
        var pos4 = event.clientY;
        console.log(pos3, pos4);
        elementAtPoint = document.elementsFromPoint(pos3, pos4)
        console.log(elementAtPoint[1].className);
        console.log(elementAtPoint[0].className);

        if (elementAtPoint[1].className == "stage_container" ){
          var stageContainer = elementAtPoint[1];
    var cardContent = elementAtPoint[0].innerHTML;
    var cardContentElement = document.createElement("div"); 
    cardContentElement.innerHTML = cardContent;
    stageContainer.appendChild(cardContentElement);
    
    elementAtPoint[0].style.display = "none";
    elementAtPoint[0].style.pointerEvents = "none";
     fetch('/update_stage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'stage_id': elementAtPoint[1].children[0].textContent, 'card_id': cardContentElement.textContent})
    })
      .then(response => response.json())
      .then(data => {
        
      });
    cardContentElement.addEventListener("click", function() {
      var stringContent = cardContentElement.textContent;
      var first_word = stringContent.split(' ')[0];
      console.log(first_word);
      $.ajax({
        url: `/${first_word}`,
        type: 'GET',
        dataType: 'json',
        success: function(data){

          var cardText = data.textlist[stringContent.charAt(stringContent.length - 1)-1]; // 根据索引获取对应的文本
        console.log(stringContent.charAt(stringContent.length - 1));

          textContainer.text("details:"+ cardText); // 在textContainer中显示文本
        }
       });
        
    });
  }    
      });
      cardContainer.append(card); // 将卡片添加到容器中

  }
}



// function create_stage() {
//   // Create a new textbox element
//   var stage = document.createElement("stage" + counter.toString());
//   stage.className = "stage_container";
//   var text = document.createElement('div')
//   text.className = "stage_tag";
//   text.textContent = "Stage" + counter.toString();
//   stage.appendChild(text);

//   // Make the textbox draggable
//   makeElementDraggable(stage);
//   // Append the textbox to the container
//   var container = document.getElementById("stage_set_all");
//   container.appendChild(stage);

//   var leftButton = document.createElement('button');
//   leftButton.className = 'stage_button left';
//   stage.appendChild(leftButton);
  
//   var rightButton = document.createElement('button');
//   rightButton.className = 'stage_button right';
//   stage.appendChild(rightButton);

//   makeElementDraggable(leftButton);
//   makeElementDraggable(rightButton);

//   // 创建 SVG 元素
//   var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   svg.setAttribute("class", "stage_line");
//   svg.style.position = "absolute";
//   svg.style.top = "0";
//   svg.style.left = "0";
//   svg.style.width = "100vw"; // 使用视窗宽度
//   svg.style.height = "100vh"; // 使用视窗高度
//   svg.style.pointerEvents = "none"; // 禁止SVG元素捕获鼠标事件
//   container.appendChild(svg); // 将SVG元素添加到容器中

//   // 创建线条元素
//   var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//   line.setAttribute("stroke", "black");
//   line.setAttribute("stroke-width", "2");
//   line.style.display = 'none'; // 初始状态下隐藏线条
//   svg.appendChild(line);

//   // 监听左按钮的点击事件
//   leftButton.addEventListener('click', function(event) {
//     var leftButtonX = event.pageX;
//     var leftButtonY = event.pageY;

//     line.setAttribute('x1', leftButtonX);
//     line.setAttribute('y1', leftButtonY);
//     line.style.display = 'block'; // 显示线条

//     // 添加鼠标移动事件监听器到文档上
//     document.addEventListener('mousemove', updateLinePosition);

//     // 鼠标移动时更新线条终点位置
//     function updateLinePosition(event) {
//       var mouseX = event.pageX;
//       var mouseY = event.pageY;
//       line.setAttribute('x2', mouseX);
//       line.setAttribute('y2', mouseY);
//     }

//     // 鼠标松开时移除鼠标移动事件监听器
//     document.addEventListener('mouseup', function() {
//       document.removeEventListener('mousemove', updateLinePosition);
//     });
//   });

//   // 监听stage的拖动事件
//   makeElementDraggable(stage);
//   var isDragging = false;
//   var offsetX = 0;
//   var offsetY = 0;
  
//   stage.addEventListener('mousedown', function(event) {
//     isDragging = true;
//     offsetX = event.pageX - parseInt(stage.style.left);
//     offsetY = event.pageY - parseInt(stage.style.top);
//   });
  
//   stage.addEventListener('mousemove', function(event) {
//     if (isDragging) {
//       var stageX = event.pageX - offsetX;
//       var stageY = event.pageY - offsetY;
  
//       stage.style.left = stageX + 'px';
//       stage.style.top = stageY + 'px';
  
//       var lineX1 = stageX + stage.offsetWidth;
//       var lineY1 = stageY + stage.offsetHeight / 2;
  
//       line.setAttribute('x1', lineX1);
//       line.setAttribute('y1', lineY1);
//     }
//   });
  
//   stage.addEventListener('mouseup', function() {
//     isDragging = false;
//   });



//   fetch('/world', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ text: "Stage" + counter.toString(), id: 6 })
//   })
//     .then(response => response.json())
//     .then(data => {
//     });
  
//   counter += 1;
// }

var counter = 1; // Counter for unique numbers
var stageIds = []; 
var stageGraphe = {}
function create_stage() {
  // 创建一个新的文本框元素
  var stage = document.createElement('div');
  stage.setAttribute("id", "stage" + counter.toString());
  stage.className = "stage_container";
  var text = document.createElement('div')
  text.className = "stage_tag";
  text.textContent = "Stage" + counter.toString();
  stage.appendChild(text);

  // 使文本框可拖动
makeElementDraggable(stage);
  // 将文本框添加到容器中
  var container = document.getElementById("stage_set_all");
  container.appendChild(stage);

  var Button = document.createElement('button');
  Button.className = 'stage_button';
  stage.appendChild(Button);
  // stage = new PlainDraggable(document.getElementById("stage" + counter.toString()));

  makeElementDraggable(Button);
  Button.addEventListener('click', handleStageButtonClick);
  

  fetch('/world', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: "Stage" + counter.toString(), id: 6 })
  })
    .then(response => response.json())
    .then(data => {
    });

  stageIds.push(stage.id); // 将舞台元素的ID添加到数组中
  stageGraphe["stage" + counter.toString()] = []
  console.log(stageGraphe)
  counter += 1;
}


//working-----

// function handleStageButtonClick(event) {
//   var button = event.target;
//   var stage = button.parentNode;
//   var stageId = stage.id;
//   var isClicked = false;

//   var filteredList = stageIds.filter(function(id) {
//     return id !== stageId;
//   });
//   console.log(filteredList);
//   function establishLink() {
//     for (var i = 0; i < filteredList.length; i++) {
//         var nextStage = document.getElementById(filteredList[i]);
//         nextStage.addEventListener('click', function() {
//          if (!isClicked) {
//           console.log("Link established, stage " + stageId + " and stage " + this.id);
//           isClicked = true;
//           console.log(isClicked);
//           }
//         else {
//           console.log("Link already established");
//       }
//     });
//     }
//   }
//   establishLink();
// }

var line_start = 0;
var line_end = 0;
var line_dict = {}
var have_listener = false
var what_stage_pink = {pink:['stage1','stage3','stage4']}



function swith_stage_condition(event){
  // const modal = document.querySelector(event.target.dataset.modalTarget)
  document.querySelector('.popup').style.display='flex'
}
function handleStageButtonClick(event) {
  event.stopPropagation();

  var button = event.target;
  var stage = button.parentNode;
  var stageId = stage.id;

  var filteredList = stageIds.filter(function(id) {
    return id !== stageId;
  });
  console.log(filteredList);

  // function handleClick(event) {
  // const clickedElementId = event.target.id;
  // if (!stageIds.includes(clickedElementId)) {
  //   console.log(clickedElementId)
  //   console.log('Clicked element is not in the array of stage IDs');
  //   document.removeEventListener('click', handleClick);
  //   return; // End the function
  // }}
  // document.addEventListener('click', handleClick);
  function establishLink(event) {
    const clickedElementId = event.target.id;
    console.log(filteredList.includes(clickedElementId))
        if (filteredList.includes(clickedElementId) && !stageGraphe[stageId].includes(clickedElementId)){
          console.log("Link established, stage " + stageId + " and stage " + clickedElementId);
          stageGraphe[stageId].push(clickedElementId)
          line_start = stageId.slice(5)
          line_end = clickedElementId.slice(5)
          console.log(line_start, line_end)
          if (!line_dict[line_start]){
          line_dict[line_start] = Array(100);}
          // make a cricle plus sign button between document.getElementById(stageId) and document.getElementById(clickedElementId)
          var circleButton = document.createElement('div');
          circleButton.classList.add('circle-button');
          var plusSign = document.createElement('div');
          plusSign.classList.add('plus-sign');
          plusSign.textContent = '+';
          circleButton.appendChild(plusSign);
var container = document.getElementById('stage_set_all');
container.appendChild(circleButton);
makeElementDraggable(circleButton);
circleButton.addEventListener('dblclick', swith_stage_condition);


          line_dict[line_start][line_end] = [new LeaderLine(document.getElementById(stageId),circleButton),new LeaderLine(circleButton, document.getElementById(clickedElementId)), circleButton,'']
          document.removeEventListener('click', establishLink)
          have_listener = false          
        }
        else{console.log('link already established');
        document.removeEventListener('click', establishLink)
        have_listener = false

      }
      
    }
  if (have_listener == false){
  document.addEventListener('click', establishLink)}
  else{console.log('please finish the previous linking first ')}
  have_listener = true

}
// Function to make an element draggable
function makeElementDraggable(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {

    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // var ele_id = element.id.slice(5)
  //   if (line_dict[ele_id]){
  //   for(var i =0;i<line_dict[ele_id].length;i++)
  //   {
  //     var line = line_dict[ele_id][i]
  //     line.start = { element: ele_id, align: 'auto' };
  //   }
  // }
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    for (var key in line_dict){
      for(var i = 0; i < line_dict[key].length; i++)
      {
        if (line_dict[key][i]){
        line_dict[key][i][0].remove()
        line_dict[key][i][0] = new LeaderLine(document.getElementById('stage'+key), line_dict[key][i][2])
        line_dict[key][i][1].remove()
        line_dict[key][i][1] = new LeaderLine(line_dict[key][i][2],document.getElementById('stage'+i) )}
      }
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Attach event listener to the button
var createBtn = document.getElementById("createBtn");
createBtn.addEventListener("click", createDraggableTextbox);

function isCenterOverlapping(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var overlap = false;
  var elementAtPoint;
  element.onmousedown = init_pos;
  function init_pos(e){

    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = overlappchecker;}
  function overlappchecker(){
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elementAtPoint = document.elementFromPoint(pos3, pos4)
    
    var rect1 = element.getBoundingClientRect();
    var rect2 = elementAtPoint.getBoundingClientRect();
    var center1X = rect1.left + rect1.width / 2;
    var center1Y = rect1.top + rect1.height / 2;
    if (elementAtPoint.className == "stage_container"){
    overlap = center1X >= rect2.left &&
    center1X <= rect2.right &&
    center1Y >= rect2.top &&
    center1Y <= rect2.bottom}
  };
  function closeDragElement() {
    if(overlap = True){
      var currentWidth = element.offsetWidth;
      var currentHeight = element.offsetHeight;

element.style.width = currentWidth / 2 + "px";
element.style.height = currentHeight / 2 + "px";
      elementAtPoint.appendChild(element)
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
// page 3

function updateHistory(barNumber) {
  const typingBar = document.getElementById(`typing-bar-${barNumber}`);
  const outputSection = document.getElementById(`output-section-${barNumber}`);
  const entry = document.createElement("div");
  entry.className = "entry";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "−";
  entry.appendChild(deleteButton);

  const entryText = document.createElement("span");
  entryText.innerHTML = typingBar.value;
  entry.appendChild(entryText);
  deleteButton.onclick = function () {
    entry.remove();
  };

  outputSection.appendChild(entry);
  // Send input data to the Python server
  fetch('/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify({ text: typingBar.value })
    body: JSON.stringify({text: typingBar.value , id:barNumber})
  })
    .then(response => response.json())
    .then(data => {
// entryText.innerHTML = data.output;
    });
  typingBar.value = "";
}



function sendGenerateData() {
  const outputSection = document.getElementById("output-section");
const entry = document.createElement("div");
  entry.className = "entry";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "−";
  entry.appendChild(deleteButton);

  const entryText = document.createElement("span");
  entry.appendChild(entryText);
  deleteButton.onclick = function () {
    entry.remove();
  };
  // Send input data to the Python server
  fetch('/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text:"generate", id:5 })
  })
  .then(response => response.json())
  .then(data => {
      console.log(':', data);
      entryText.innerHTML = data.aioutput;
  })
  .catch(error => {
      console.error('error', error);
  });
  outputSection.appendChild(entry);
}

// others


function showNextPage() {
  document.getElementById('page-1').classList.remove('active');
  document.getElementById('page-2').classList.add('active');
  document.getElementById('page-3').classList.remove('active');
  for (var key in line_dict){
    for(var i = 0; i < line_dict[key].length; i++)
    {
      if (line_dict[key][i]){
      line_dict[key][i][0].show()
      line_dict[key][i][1].show()}
    }
  }
}

function showPreviousPage() {
  document.getElementById('page-2').classList.remove('active');
  document.getElementById('page-1').classList.add('active');
  document.getElementById('page-3').classList.remove('active');
  for (var key in line_dict){
    for(var i = 0; i < line_dict[key].length; i++)
    {
      if (line_dict[key][i]){
      line_dict[key][i][0].hide()
      line_dict[key][i][1].hide()}
    }
  }
}

function showNextPage2() {
  document.getElementById('page-1').classList.remove('active');
  document.getElementById('page-2').classList.remove('active');
  document.getElementById('page-3').classList.add('active');
  for (var key in line_dict){
    for(var i = 0; i < line_dict[key].length; i++)
    {
      if (line_dict[key][i]){
      line_dict[key][i][0].hide()
      line_dict[key][i][1].hide()}
    }
  }
  console.log('fine2')

  set_img(stageGraphe,what_stage_pink)
//   var imageElement = document.getElementById('stagedi');
//   imageElement.remove();
//   setTimeout(function() {
//     var img_col = document.getElementById('img_col');
//   var imgElement = document.createElement('img');
// // Set the attributes for the img element
// imgElement.src = "/static/scan.jpg";
// imgElement.id = 'stagedi'
// img_col.appendChild(imgElement);
//   }, 2000);
  
}

function showPreviousPage2() {
  document.getElementById('page-1').classList.remove('active');
  document.getElementById('page-3').classList.remove('active');
  document.getElementById('page-2').classList.add('active');
  for (var key in line_dict){
    for(var i = 0; i < line_dict[key].length; i++)
    {
      if (line_dict[key][i]){
      line_dict[key][i][0].show()
      line_dict[key][i][1].show()}
    }
  }
}
function onPageLoadOrRefresh() {
  fetch('/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(data => {
    });
}

function set_img(data, what_stage_pink) {
  console.log(what_stage_pink)
  fetch('/set_pink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(what_stage_pink)
  })
    .then(response => response.json())
    .then(data => {
    });

  fetch('/set_img', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.blob()) // Retrieve the image as a Blob
    .then(blob => {
      // Create a URL object from the Blob
      const imageURL = URL.createObjectURL(blob);

      // Create a new <img> element
      const imgElement = document.createElement('img');
      imgElement.src = imageURL;

      // Append the <img> element to a container on the page
      
      const container = document.getElementById('img_col');
while (container.firstChild) {
  container.removeChild(container.firstChild);
}
      container.appendChild(imgElement);
    });
}