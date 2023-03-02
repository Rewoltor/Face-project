document.addEventListener('DOMContentLoaded', event => {

    const app = firebase.app();

    const db = firebase.firestore();

    const myPost = db.collection('post').doc('firstpost')

    myPost.get()
      .then(doc => {

            const data = doc.data();
            // document.write( data.title + `<br>`)
            // const a = data.title
            
        })

})
//session ID
const msg1 = localStorage.getItem("userID")
document.getElementById("userIDses").value = msg1


window.onload = function() {
  let link = localStorage.getItem("pageID")

  const ref = 'pics/' + link + '.png'
  document.getElementById('image').src = ref

  document.getElementById("counter").innerHTML = link + '/30'
}


function start() {

  //get user input
  const gender = document.getElementById('gender').value
  const age = document.getElementById('age').value
  const userID = Math.random().toString(16).slice(2)

  //get current date
  var currentdate = new Date(); 
  var datetime =  currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear() + " @ "  
                  + currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds();

  //URL parameter
  let url = new URL(window.location.href)
  let params = new URLSearchParams(url.search)
  let value = params.get('id')

  localStorage.setItem("userID", userID)

  //create userID Session
  localStorage.setItem("pageID", 1)

  //create userID Session
  const db = firebase.firestore()

  //write to database
  db.collection("users").doc(userID).set({
    age: age,
    gender: gender,
    'hiddenID': value,
    'date': datetime
  })

  //starts answers database so it can be updated later
  db.collection("answers").doc(userID).set({
    '1': 'null'
  })


  .then(() => {
      console.log("Document successfully written!")
      
      const userID = localStorage.getItem("userID")

      localStorage.setItem("userID", userID)

      // alert(userID + " is your userID")
      window.location.href = "test.html"
  })
  .catch((error) => {
      console.error("Error writing document: ", error)
  });

}



function test(val) {
  
  const userID = localStorage.getItem("userID")
  const answer = document.getElementById("answer").innerHTML = val
  let pageID = parseInt(localStorage.getItem("pageID")) // parse pageID as integer


  //alert(" userID: " +userID + "   answer: " + answer + "   pageID: " + pageID)

  const db = firebase.firestore()

  db.collection("answers").doc(userID).update({
    [pageID]: answer
  })


  .then(() => {
    console.log("Document successfully updated!")
    const nextPage = pageID + 1
    localStorage.setItem("pageID", nextPage)

    if(pageID > 29) {
      window.location.href = "/finish.html"
    }else{
      //this reloads the page so the img and the text refreshes
      window.location.href = "/test.html"
    }
  })
  .catch((error) => {
    console.error("Error updating document: ", error)
  });
}

function calculate() {

  const db = firebase.firestore();
  const userID = localStorage.getItem("userID")
  const email = document.getElementById("email").value

  db.collection("answers").doc(userID).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        let sum = 0;
        console.log(data)
        Object.keys(data).forEach((key) => {
          sum += Number(data[key]);
        });
        console.log("Sum of answers:", sum)

        //percentile function
        const percentile = (arr, val) =>
            (100 * arr.reduce(
            (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
            0 )) / arr.length;



        //calculate percentile
        const sumPercentile = Math.round( percentile ([39, 54, 27, 33, 48, 36, 25, 52, 46, 50, 44, 62, 21, 58, 27, 45, 43, 46, 62, 29, 56, 30, 39, 41, 58, 29, 35, 56, 36], sum));


        //write to database
        db.collection('results').doc(userID).set({
          'score': sum,
          'percentile': sumPercentile,
          'email': email
        })

        alert("A te eredmények a " + sumPercentile + "-dik percentilisben vannak a tesztben.")
      } else {
        console.log("No document found for userID:", userID);
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    })
}
