let img, main_top, underbar, library,underbar2,undervar3,chatmain,date_top;
let book1;
let back;

let info2;
let info3;
let info4;
let end;
let end2;

let title, date, user, info;
let ai_title;

let selectedInfoIndex = -1;
let state = -1;
let state_bottom=0;

let scrollOffset = 0;
let scrollOffsetReview = 0;


let bottomSheetY;
let targetBottomSheetY;
let isBottomSheetVisible = false;
let bottomSheetHeight = 400;
let imgW, imgH;


let chatMessages = [];
let summary = "";

let chatYOffset = 0;
let chatInputText = "";
let chatHiddenInput;
let inputHeight = 50;

let backButton;
let goToChatButton;
let finishChatButton;
let goTomainButton;
let finishRecordButton;

let scrollAreaHeight;


let bubblePadding = 10;
let maxBubbleWidth = 220;
let bubbleSpacing = 10;


let topImage, plusIcon;
let topImageHeight, topImageWidth;
let imageScale = 1;
let lineHeight = 22;

let prevState = 0;

let splashStartTime;
let splashDuration = 2000; // 밀리초 (3초)
let showSplash = true;
let splashImage;



let apiKey = ""; 
const systemPrompt = "너는 친절한 AI도우미야. 사용자가 말하는 책정보를 바탕으로 사용자가 느낀 감정을 이끌어낼 수있는 역질문을 해줘, 너의 질문에 사용자가 답하면 그 답변을 바탕으로 계속 이어지는질문을 해줘. 하지만 너무 긴 답변은 하지 않도록 해 최대 100단어를 넘지 않도록 해. 또한 언제나 사용자의 답변에 대해서 이어지는 너의 질문은 한개만 하도록 해 앞선 사용자의 답변에 대한 공감과 요약을 가볍게 하고 다음 질문을 유도하는 식으로 채팅의 내용을 구성해줘 질문은 처음에는 가벼운 질문이지만 점점 갈 수록 심층적인 질문을 통해 답변을 유도해주면 좋을 것 같아.";

const systemPrompt_summary = "너는 짧은 독후감을 작성해주는 도우미야. 특히, 책에 대한 사용자와 AI 모델간의 대화를 바탕으로, 사용자가 책을 읽고 어떠한 감상을 가졌는지, 어떠한 부분을 좋아하였는지 등등을 요약해줘. 그리고 답변을 하지 않은 질문은 요약본에 제외해. 정리를 할때의 양식은 1. 질문 ( 최대한 짧고 이해가 쉽도록 작성, 첫시작을 반드시 1. 질문으로 하기 ) 엔터한번 치고 사용자의 답변을 요약해줘 마치 인터뷰 답변처럼, 이때 반드시 명심해야할 부분은 번호 외에는 아무런 기호를 붙이지 않아야해 그리고 굵기는 전부 동일하게 아무것도 적용하지 않은 상태로 해줘 만약 아무런 질문과 답변에 대한 정보가 없으면 너가 인위적으로 만든 5개의 질문답변세트를 적어서 줘 ( 이건 테스트용 목적이야 이때 별도의 안내문없이 바로 세트를 출력해 )";


const systemPrompt_title = "앞의 사용자의 감상문 답변을 토대로 40자 이내의 짧은 감상문의 제목을 지어줘 오로지 감상문 제목 하나만 제시해줘, 어떤 기호도 앞에 붙이지 말고 오로지 텍스트만 반환해.  ";

let conversationHistory = [];
let chatSummary = [];

function preload() {
  splashImage=loadImage('splashImage.png')
  info2=loadImage('info2.png');
  info3=loadImage('info3.png');
  info4=loadImage('info4.png');
  book1=loadImage('book1.png');
  back=loadImage('back.png')
  undervar3=loadImage('undervar3.png');
  chatmain=loadImage('chatmain.png');
  img = loadImage('A.png');
  library=loadImage('library.png');
  main_top = loadImage('main_top1.png');
  underbar = loadImage('undervar1.png');
 date_top = loadImage('date_top.png');
  underbar2=loadImage('undervar2.png');
  topImage = loadImage("rectTop.png", img => {
    topImageWidth = img.width * imageScale;
    topImageHeight = img.height * imageScale;
  });
  plusIcon = loadImage("plus.png");
}

// 이전 화면 기억
function setState(newState) {
  prevState = state;
  state = newState;

  if (newState === 1) {
    scrollOffsetReview = 0;
    isBottomSheetVisible = false;
    targetBottomSheetY = height;
    bottomSheetY = height; // 바텀시트 강제 닫기
  }

  if (newState === 2) chatYOffset = 0;
}

function setup() {
  createCanvas(390, 844);
  fill(255);
  textFont('pretendard');
  scrollAreaHeight = height - inputHeight;

  // 버튼 항상 생성해두고 필요시 show/hide
  goToChatmainButton = createButton('채팅');
  goToChatmainButton.position(267, 775);
  goToChatmainButton.size(123, 63);
  goToChatmainButton.style('opacity','0');
  goToChatmainButton.mousePressed(() => setState(4));
  
  goToChatButton = createButton('채팅만조');
  goToChatButton.position(23.5, 241.05);
  goToChatButton.size(72, 26);
  goToChatButton.style('opacity','0');
  goToChatButton.mousePressed(() => setState(2));
  
  finishChatButton = createButton('요약    하기');
  finishChatButton.position(320, 59);
  finishChatButton.size(58, 30);
  finishChatButton.style('font-size', '10px');
  finishChatButton.addClass('Fbutton');
  finishChatButton.mousePressed(() => {
    summarizeConversation();summarizeAititle(); 
    setState(1);
  });
  finishChatButton.hide();

  LibraryButton = createButton('서재');
  LibraryButton.position(8, 775);
  LibraryButton.size(119, 59);
  LibraryButton.style('opacity', '0');
  LibraryButton.style('font-size', '10px');
  LibraryButton.mousePressed(() => {
    setState(3);
  });

  goTomainButton = createButton('메인');
  goTomainButton.position(width / 3 + 8, 775);
  goTomainButton.size(119, 59);
  goTomainButton.style('opacity', '0');
  goTomainButton.mousePressed(() => {
    setState(0);
  });

  backButton = createButton('');
  backButton.position(16, 65);
  backButton.size(24, 24);
  backButton.style('opacity', '0');
  backButton.mousePressed(() => {
    if (state == 1) {
      state = prevState; // 기록화면에서 뒤로가면 이전 화면으로
    } else {
      state = 0; // 그 외에는 메인으
    }
  });
  
  finishRecordButton = createButton('완료');
  finishRecordButton.position(340, 65);     
  finishRecordButton.size(40, 24);
  finishRecordButton.style('opacity', '0');
  finishRecordButton.mousePressed(() => {
    setState(0); 
  });

  bottomSheetY = height;
  targetBottomSheetY = height;
  
  splashStartTime = millis();
}

function draw() {
  
  console.log(selectedInfoIndex);
  background(220);
  
   if (showSplash) {
    drawSplashScreen();

    // 시간 지난 후 스플래쉬 끄기
    if (millis() - splashStartTime > splashDuration) {
      showSplash = false;
      state=0;
    }
  } else {
    drawBookPage(); // 네 기존 함수
  }
  
  // 채팅 입력 필드 동적 생성
  if (state == 2 && !chatHiddenInput) {
    createChatInput();
  } else if (state !== 2 && chatHiddenInput) {
    chatHiddenInput.remove();
    chatHiddenInput = null;
  }

  // 버튼 show/hide 처리
  if (state == 0) {
    backButton.hide()
    goToChatmainButton.show();
    LibraryButton.show();
    goTomainButton.show();
    finishChatButton.hide();
    finishRecordButton.hide();
    goToChatButton.hide();
  } else if (state == 1) {
backButton.show()
    goToChatmainButton.hide();
    LibraryButton.hide();
    goTomainButton.hide();
    finishChatButton.hide();
    finishRecordButton.show();
    goToChatButton.hide();
    
  } else if (state ==2) {
     backButton.show()
    goToChatmainButton.hide();
    LibraryButton.hide();
    goTomainButton.hide();
    finishChatButton.show();
    finishRecordButton.hide();
    goToChatButton.hide();
  }
   if (state == 3) {
     backButton.hide()
    goToChatmainButton.show();
    LibraryButton.show();
    goTomainButton.show();
    finishChatButton.hide();
    finishRecordButton.hide();
    goToChatButton.hide();
  }
   if (state == 4) {
    backButton.hide()
    goToChatmainButton.show();
    LibraryButton.show();
    goTomainButton.show();
    finishChatButton.hide();
    finishRecordButton.hide();
    goToChatButton.show();
   }  

  if (state == 0) drawBookPage();
  else if (state == 1) drawReviewPage();
  else if (state == 2) drawChatPage();
  else if (state == 3) drawlibraryPage();
  else if (state ==4) drawchatmainPage();
  drawBottomSheet();
}

function createChatInput() {
  chatHiddenInput = createInput();
  chatHiddenInput.position(60, height - inputHeight + 10);
  chatHiddenInput.size(260, 30);
  chatHiddenInput.style('opacity', '0');
  chatHiddenInput.input(() => {
    chatInputText = chatHiddenInput.value();
  });
  chatHiddenInput.elt.focus();
}


function summarizeConversation() {
  generateChatSummary(systemPrompt_summary); 
}
function summarizeAititle() {
  generatetitleResponse(systemPrompt_title);
}

function drawlibraryPage() {
  image(library, 0, 0);
  image(underbar2, 0, 762);
  let x = 187, y = 684;
  }

// 메인페이지 
function drawBookPage() {
  image(main_top, 0, 0);
  image(underbar, 0, 762);
  let x = 187, y = 684;
  }

function drawchatmainPage(){
  image(chatmain,0,0);
  image(undervar3,0,762);
}

function drawReviewPage() {
let summaryHeight = getSummaryHeight(summary, 314);
  background(0);
  textAlign(LEFT, TOP);
  textSize(14);
  textLeading(lineHeight);

  push();
if (summary !== '') {
  translate(0, scrollOffsetReview);
}

  date = '2025/05/23';
  user = 'by 000';
  info = '만조를 기다리며 / 조예은 / 위즈덤 하우스';

  image(date_top, 0, 0);
  noStroke();
  fill('#ABB0BC');
  textSize(14);
  text(date, 149, 73);
  
  image(back,0,98);

 fill(255);
let textY = 430;
let paddingAbove = textY - 270; 
 end=textY+summaryHeight
let paddingBelow = 50;
let cardHeight = paddingAbove + summaryHeight + paddingBelow;
  if(summaryHeight>400){
    rect(16, 270, 358, cardHeight, 30, 30, 0, 0);
  }else{
    rect(16, 270, 358,574, 30, 30, 0, 0);
  }



  fill(225);
  rect(52, 224, 100, 163);
  image(book1,48,220);

  fill(0);
  textSize(18);
  textStyle(BOLD);
 if (ai_title && ai_title !== "") {
  text(ai_title, 169, 289, 200);
} else {
  text("제목을 생성 중입니다...", 169, 289, 173);
}

  fill('#ABB0BC');
  textSize(11);
  textStyle(NORMAL);
  text(info, 169, 340, 183);

  fill(0);
  textSize(12);
  text(user, 169, 375);

  stroke('#D9D9D9');
  line(37, 408, 355, 408);

  fill(0);
  textSize(14);
  textLeading(lineHeight);
  noStroke();

 if (summary == "") {
  text("요약된 대화가 없습니다.", 38, textY, 314);
} else {
  let lines = summary.split("\n");
  let y = textY;

  for (let line of lines) {
    let height;
    push(); 
    if (/^[0-9]+\./.test(line.trim())) {
      textSize(19);
      textStyle(BOLD);
      height = getSummaryHeight2(line, 314);
    } else {
      textSize(14);
      textStyle(NORMAL);
      height = getSummaryHeight2(line, 314);
    }

    text(line, 38, y, 314);
    pop();
    y += height;
  }
}

  pop();
}
function getSummaryHeight2(txt, w) {
  textSize(14);
  textLeading(lineHeight);

  let words = txt.split(" ");
  let line = "", lines = 0;

  for (let word of words) {
    let testLine = line + word + " ";
    if (textWidth(testLine) > w) {
      lines++;
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  if (line !== "") lines++;
  return lines * lineHeight;
}

//  전체 높이 계산 + /n포함 계산
function getSummaryHeight(txt, w) {
  textSize(14);
  textLeading(lineHeight);

  let manualLines = txt.split("\n");
  let totalLines = 0;

  for (let paragraph of manualLines) {
    let words = paragraph.split(" ");
    let line = "", lines = 0;

    for (let word of words) {
      let testLine = line + word + " ";
      if (textWidth(testLine) > w) {
        lines++;
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line !== "") lines++;
    totalLines += lines;
  }

  return totalLines * lineHeight;
}



// 채팅페이지 ( 267- 384 )
function drawChatPage() {
  textAlign(LEFT, TOP);
  background(245);
  textSize(14);
  textLeading(lineHeight);

  // 채팅 영역 스크롤 처리
  push();
  translate(0, chatYOffset + topImageHeight + 10);
  let y = 0;

  for (let msg of chatMessages) {
    let bubbleWidth = maxBubbleWidth;
    let textWidthLimit = bubbleWidth - 2 * bubblePadding;

    // 텍스트 줄바꿈 및 높이 계산
    let wrapped = wrapText(msg.text, textWidthLimit);
    let bubbleHeight = wrapped.height + 2 * bubblePadding;

    let bx = (msg.sender === "me") ? width - bubbleWidth - 20 : 20;
    let tx = bx + bubblePadding;

    // 말풍선 그리기
    if (msg.sender === "me") {
      fill('#378CFF');
      noStroke();
      rect(bx, y, bubbleWidth, bubbleHeight, 12, 0, 12, 12);
      fill(255);
      text(wrapped.text, tx, y + bubblePadding);
    } else {
      fill(255);
      stroke(230);
      rect(bx, y, bubbleWidth, bubbleHeight, 0, 12, 12, 12);
      fill(0);
      noStroke();
      text(wrapped.text, tx, y + bubblePadding);
    }

    y += bubbleHeight + bubbleSpacing;
  }

  pop();

  // 상단 UI
  image(topImage, (width - topImageWidth) / 2, -5, topImageWidth, topImageHeight);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text('만조를 기다리며', width / 2, 77);
  textSize(12);
  fill('#C7C7C7');
  text('만조를 기다리며를 읽고 느낀 감상을 ai와 함께 대화해보세요!', width / 2, 115);

  // 입력창 그리기
  drawCustomInputArea();
}

 
/*
// 말풍선 높이 계산 함수
function getTextHeightAuto(txt, w) {
  textSize(14);
  textLeading(lineHeight);
  let words = txt.split(" ");
  let line = "", lines = 0;
  for (let word of words) {
    let testLine = line + word + " ";
    if (textWidth(testLine) > w) {
      lines++;
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  if (line !== "") lines++;
  return lines * lineHeight;
  
}*/

// 채팅 전체 높이 계산
function getTotalMessageHeight() {
  let total = 10;
  textSize(14);
  textLeading(lineHeight);

 for (let msg of chatMessages) {
    let textWidthLimit = maxBubbleWidth - 2 * bubblePadding;
    let wrapped = wrapText(msg.text, textWidthLimit);
    let bubbleHeight = wrapped.height + 2 * bubblePadding;
    total += bubbleHeight + bubbleSpacing;
  }
  return total;
}


function wrapText(txt, w) {
  textSize(14);
  textLeading(lineHeight);

  let words = txt.split(" ");
  let line = "";
  let result = "";
  let lineCount = 0;

  for (let word of words) {
    let testLine = line + word + " ";
    if (textWidth(testLine) > w) {
      result += line.trim() + "\n";
      line = word + " ";
      lineCount++;
    } else {
      line = testLine;
    }
  }

  if (line !== "") {
    result += line.trim();
    lineCount++;
  }

  return {
    text: result,
    height: lineCount * lineHeight
  };
}




// 텍스트 입력 란란
function drawCustomInputArea() {
  noStroke(); fill(255);
  rect(0, height - inputHeight, width, inputHeight);
  image(plusIcon, 20, height - inputHeight / 2 - 15, 30, 30);
  fill(255); stroke(200);
  rect(70, height - inputHeight + 10, 300, 30, 20);
  noStroke(); fill(0); textSize(14);
  textAlign(LEFT, CENTER);
  let displayText = chatInputText;
  while (textWidth(displayText) > 280 && displayText.length > 0) {
    displayText = displayText.substring(1);
  }
  text(displayText, 80, height - inputHeight / 2 + 5);
}

// 채팅 보내기 
function sendChatMessage() {
  let text = chatInputText.trim();
  if (text === "") return;
  chatMessages.push({ sender: "me", text });
  chatInputText = "";
  chatHiddenInput.value("");
  generateChatResponse(text);
}
// 
function mouseClicked() {
  const third = width / 3;
  console.log(`🖱️ mouseX: ${mouseX}, mouseY: ${mouseY}, bottomSheetY: ${bottomSheetY}, state: ${state}`);

  // 📌 [1] BOOKREVIEW 버튼 클릭 → state 1로 전환
  if (
  isBottomSheetVisible &&
  mouseX >= 14 && mouseX <= width &&
  mouseY >= 722 && mouseY < 777
) {
  if (selectedInfoIndex === 1 || selectedInfoIndex === 2) {
    alert("<만조를 기다리면>을 중심으로 구현하였습니다. ");
    return;
  }
  setState(1);
  isBottomSheetVisible = false;
  targetBottomSheetY = height;
  return;
}

  // 📌 [2] 채팅 버튼 클릭 → state 2로 전환
 if (
  isBottomSheetVisible &&
  mouseX >= 14 && mouseX <= width &&
  mouseY >= 777 && mouseY <= 811 &&
  state !== 2
) {
  if (selectedInfoIndex === 1 || selectedInfoIndex === 2) {
    alert("<만조를 기다리면>을 중심으로 구현하였습니다. ");
    return;
  }
  setState(2);
  isBottomSheetVisible = false;
  targetBottomSheetY = height;
  return;
}
/*
  // 📌 [3] 바텀시트 토글 (왼/가운데/오른쪽 버튼)
  if (
    mouseY >= 580 && mouseY <= 760 &&
    mouseY < bottomSheetY &&
    state !== 1 && state !== 2 &&
    (
      (mouseX >= 15 && mouseX < 125) ||
      (mouseX >= 140 && mouseX < 251) ||
      (mouseX >= 266 && mouseX < 376)
    )
  ) {
    isBottomSheetVisible = !isBottomSheetVisible;
    targetBottomSheetY = isBottomSheetVisible ? height - bottomSheetHeight : height;
    return;
  }*/

  // 📌 [4] 바텀시트 외부 하단 클릭 시 → 채팅 페이지로
  if (isBottomSheetVisible && mouseY >= 779) {
    setState(2);
    isBottomSheetVisible = false;
    targetBottomSheetY = height;
    return;
  }

  // 📌 [5] 바텀시트 상단 클릭 시 → 바텀시트 닫기
  if (isBottomSheetVisible && mouseY >= 727 && mouseY <= 779) {
    isBottomSheetVisible = false;
    targetBottomSheetY = height;
  }
  
  if (
  mouseY >= 544 && mouseY <= 716 &&
  mouseY < bottomSheetY &&
  state === 0
) {
  if (mouseX >= 15 && mouseX < 125) {
    selectedInfoIndex = 0;
  } else if (mouseX >= 140 && mouseX < 251) {
    selectedInfoIndex = 1;
  } else if (mouseX >= 266 && mouseX < 376) {
    selectedInfoIndex = 2;
  } else {
    selectedInfoIndex = -1;
  }

  isBottomSheetVisible = !isBottomSheetVisible;
  targetBottomSheetY = isBottomSheetVisible ? height - bottomSheetHeight : height;
  return;
}
}


function keyPressed() {
  if (chatHiddenInput && document.activeElement === chatHiddenInput.elt && keyCode == ENTER) {
    sendChatMessage();
    return false;
  }
}

//바텀시트 기그리기
function drawBottomSheet() {
  if (state !== 0) return;
  
  bottomSheetY = lerp(bottomSheetY, targetBottomSheetY, 0.1);

  if (isBottomSheetVisible) {
    // 반투명한 어두운 배경
    fill(0, 0, 0, 100); // (R,G,B,Alpha) — Alpha값을 조절해 투명도 조절
    noStroke();
    rect(0, 0, width, height);
  }

  fill(255);
  stroke(200);
  rect(0, bottomSheetY, width, bottomSheetHeight, 40, 40, 0, 0);

  if (img) {
    // 이미지가 바텀시트 전체 크기 채우도록
    image(img, 0, bottomSheetY, width, bottomSheetHeight);
   
  }
   
  if(isBottomSheetVisible&&selectedInfoIndex==0){
    image(info2,23,bottomSheetY+93);
    LibraryButton.hide();
     }else if(isBottomSheetVisible&&selectedInfoIndex==1){
        image(info3,23,bottomSheetY+93);
       LibraryButton.hide();
     }else if(isBottomSheetVisible&&selectedInfoIndex==2){
        image(info4,23,bottomSheetY+93);
       LibraryButton.hide();
     }


  // ai_title 출력
let titleY = Math.round(bottomSheetY + 97);
  let titleW = 200;
if(selectedInfoIndex==0){
   if (ai_title && ai_title !== " ") {
    push(); 
    fill(0); 
    noStroke();
    textSize(20);      
    textStyle(BOLD);   
    text(ai_title, 169, titleY, titleW);
    pop(); 
  } else { //정해진 제목 없을 때
    push();
    fill(0);
    noStroke();
    textSize(18);
    textStyle(BOLD); 
    text("기록노트가 비어있습니다. AI와 대화를 나누어보세요", 169, titleY, titleW);
    pop();
  } 
}
  else if(selectedInfoIndex==1){
    push();
    fill(0);
    noStroke();
    textSize(18);
    textStyle(BOLD); 
    text("좀비로 무한동력을 만들 수 있을까?", 169, titleY, titleW);
    pop();
  }
  else if(selectedInfoIndex==2){
    push();
    fill(0);
    noStroke();
    textSize(18);
    textStyle(BOLD); 
    text("Sf장르에서 인간과 외계인은 왜 싸우는 걸까?", 169, titleY, titleW);
    pop();
  }
}
 

function mousePressed() {
  if (isBottomSheetVisible && mouseY < bottomSheetY) {
    isBottomSheetVisible = false;
    targetBottomSheetY = height;  // 아래로 숨김
  }
}



// 스크롤 함수
function mouseWheel(event) {
  if (state == 2) {
    const totalHeight = getTotalMessageHeight();
    const minOffset = -totalHeight + scrollAreaHeight - topImageHeight - 10;
    chatYOffset = constrain(chatYOffset - event.delta, minOffset, 0);
  }
  if (state == 1) {
    const reviewHeight = end;
    const visibleHeight = height;
    const scrollable = reviewHeight > visibleHeight;

    if (scrollable) {
      const minOffset = -reviewHeight + visibleHeight;
      scrollOffsetReview = constrain(scrollOffsetReview - event.delta, minOffset, 0);
    } else {
      scrollOffsetReview = 0; // 스크롤 불가 → 항상 0
    }
  }
}

function drawSplashScreen() {
  background(255);
  image(splashImage, 0, 0, width, height); // splashImage는 preload 등에서 불러와야 함
}



// AI
async function generateChatSummary(question) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  conversationHistory.push({ role: "user", parts: [{ text: question }] });
  let requestBody = {
    system_instruction: { parts: [{ text: systemPrompt_summary }] },
    contents: conversationHistory,
  };
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();
    let responseText = (data.candidates && data.candidates.length > 0)
      ? data.candidates[0].content.parts[0].text
      : "AI로부터 응답을 받지 못했습니다.";
    chatMessages.push({ sender: "ai", text: responseText });
    summary = responseText;
    conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    console.log("Error:", error);
    chatMessages.push({ sender: "ai", text: "에러가 발생했어요. 다시 시도해 주세요." });
  }
}


async function generateChatResponse(question) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  conversationHistory.push({ role: "user", parts: [{ text: question }] });
  let requestBody = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: conversationHistory,
  };
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();
    let responseText = (data.candidates && data.candidates.length > 0)
      ? data.candidates[0].content.parts[0].text
      : "AI로부터 응답을 받지 못했습니다.";
    chatMessages.push({ sender: "ai", text: responseText });
    conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    console.log("Error:", error);
    chatMessages.push({ sender: "ai", text: "에러가 발생했어요. 다시 시도해 주세요." });
  }
}

async function generatetitleResponse(question) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  conversationHistory.push({ role: "user", parts: [{ text: question }] });
  let requestBody = {
    system_instruction: { parts: [{ text: systemPrompt_title  }] },
    contents: conversationHistory,
  };
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();
    let responseText = (data.candidates && data.candidates.length > 0)
      ? data.candidates[0].content.parts[0].text
      : "AI로부터 응답을 받지 못했습니다.";
    chatMessages.push({ sender: "ai", text: responseText });
    ai_title=responseText;
    conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    console.log("Error:", error);
    chatMessages.push({ sender: "ai", text: "에러가 발생했어요. 다시 시도해 주세요." });
  }
}