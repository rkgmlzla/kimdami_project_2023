const $ = (selector) => document.querySelector(selector)


 // const todayText = document.querySelector(".date-text");
 // let today = new Date();
 // const dayArray = ["S", "M", "T", "W", "TH", "F", "SA"];
//  todayText.innerText = `${today.getFullYear()}. ${
 //   today.getMonth() + 1
//  }. ${today.getDate()}. ${dayArray[today.getDay()]}`;

 // todayText.innerText =`${today.getFullYear()}${("0" + (today.getMonth() + 1)).slice(-2)}${(
 //   "0" + today.getDate()
//  ).slice(-2)}`;



  var my_tbody = document.getElementById('my-tbody');
  var button, buttonText, cell4;
  var table_row = [];
  // =============== 추가하기 ================
  function add_Row() {
    var row = my_tbody.insertRow(my_tbody.rows.length ); // 하단에 추가
    var cell1 = row.insertCell(0); // 새 행에 cell 추가, 0번
    var cell2 = row.insertCell(1); // 1번
    var cell3 = row.insertCell(2); // 2번
    cell4 = row.insertCell(3); // 3번
    cell1.innerText = document.getElementById('day').value;
    cell2.innerText = document.getElementById('amount').value;
    cell3.innerText = document.getElementById('memo').value; 

    button = document.createElement('button'); // <button></button>
    button.className = 'delete_button';
   // classList.contatins("delete_button")
    buttonText = document.createTextNode('delete'); // delete라는 문자열 생성
    button.appendChild(buttonText); // <button class="delete_button">delete</button>
    cell4.appendChild(button);

    // ====== tr한테 id 주기 ===== 
    table_row = row;
    table_row.id = my_tbody.rows.length
    my_tbody.append(table_row)
    
   
    

    // =============== 금액 계산 ==============
    var table = document.getElementById('head_table');
    var rowList = table.rows 
    var sum = 0;


    for (i=0; i<rowList.length; i++) {
      var row_value = rowList[i].cells[1].innerHTML;
      sum = sum + parseInt(row_value)
      document.querySelector('#sum').innerText = '합계  :   ' + String(sum)+'원'
    }


    

    // ================ 버튼 클릭해서 행 삭제 ===========
    for(let i=0; i< my_tbody.rows.length; i++) { 
      my_tbody.rows[i].cells[3].onclick = function() {
        row_value = this.parentElement.children[1].innerText // 클릭된 버튼 행의 부모 요소(tr)의 자식요소인 td들 > 1번째가 금액이기 때문에, <td>___</td>의 innerText에 접근
        sum = sum - parseInt(row_value) // text를 숫자로 변환
        var parent = document.querySelector('#my-tbody')

        parent.removeChild(this.parentElement) // 버튼의 부모 요소 : tr,   this : 버튼
        document.querySelector('#sum').innerText = '합계  :   ' + String(sum)+'원'

        // =========== id 다시 정렬하는 부분 ==========
        // for(i=0; i<my_tbody.rows.length; i++) {
        //   my_tbody.childNodes[i].id = i; // 행이 줄어들었기 때문에 tr들의 id도 처음부터 다시 정렬 
        // }   
      }  
    }
  }
