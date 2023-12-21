
const app = {
  //INIT
  firstValue:"",
  secondValue:"",
  buttons : {
    btn_7: 7,
    btn_8: 8,
    btn_9: 9,
    btn_del: "DEL",
    btn_4: 4,
    btn_5: 5,
    btn_6: 6,
    btn_plus:"+",
    btn_1:1,
    btn_2:2,
    btn_3:3,
    btn_minus:"-",
    btn_dot:".",
    btn_0:0,
    btn_divide:"/",
    btn_multiple:"x",
    btn_reset:"RESET",
    btn_equal:"=",
  },

  selectedTheme: 'theme-1-grey',
  
  init: () => {
    app.createButtonCalculator();
    app.changeTheme();
  },

  // MULTIPLY FUNCTION 
  multiply:(a,b)=>{
    return (a * b);
  },

  // DIVIDE FUNCTION 
  divide:(a,b)=>{
    if(b>0){
      return (a/b);
    }else{
      return `!Err`;
    }
  },

  // SUBSTRACT FUNCTION 
  substract:(a,b)=>{
    return (a-b);
  },

  // SUM FUNCTION 
  sum:(a,b)=>{
    return a + b;
  },

  changeTheme:()=>{
    const themeButtons = document.querySelectorAll(".calculator__header--theme .background button");
    themeButtons.forEach(btn=>{
      btn.addEventListener("click",()=>{
        app.selectedTheme = btn.id;
        document.querySelector("html").className= app.selectedTheme;
        document.querySelector('.show').className = 'hidden';
        btn.className = 'show';
      });
    });

  },

  // CREATE BUTTONS FUNCTIONS
  createButtonCalculator:()=>{
    const panelCalculator = document.querySelector(".calculator__buttons--create"); // Sélection zone de création - Point d'ancrâge pour création boutons
  
    for(const [key, value] of Object.entries(app.buttons)){ // on crée les boutons selon l'objet buttons

      //console.log(typeof value);
      if(typeof value === "number"){ // si c'est un nombre (ajout class btn-number)
        panelCalculator.innerHTML += `<button class="calculator__buttons--btn btn-number --${key}">${value}</button>`;
      }else{ // sinon (ajout class btn-operator)
        panelCalculator.innerHTML += `<button class="calculator__buttons--btn btn-operator --${key}">${value}</button>`;
      }

    }
    app.selectButtonCalculator(); // Call sélection boutons / Point d'ancrâge
  },

  // SELECT BUTTONS FUNCTIONS
  selectButtonCalculator:()=>{
    const screenCalculator = document.querySelector(".calculator__screen--write"); // Selection de l'afficheur
    const buttonsNumberCalculator = document.querySelectorAll(".btn-number"); // Selection de tous les boutons numériques
    const buttonsOperatorCalculator = document.querySelectorAll(".btn-operator");  // Selection de tous les boutons opérateurs
    app.clickButtonsNumberCalculator(buttonsNumberCalculator, screenCalculator); // Call pour créer event sur boutons numériques + envoi des selections + écran
    app.clickButtonsOperatorCalculator(buttonsOperatorCalculator, screenCalculator); // Call pour créer event sur boutons opérateurs + envoi des selections + écran
  },

  // CLICK NUMBER BUTTONS FUNCTIONS EVENT
  clickButtonsNumberCalculator:(buttonsNumberCalculator, screenCalculator)=>{
    buttonsNumberCalculator.forEach(btn=>{ // on écoute click sur chaque boutons numérique
      btn.addEventListener("click", (e)=>{ 
        const selectedButton = e.target.textContent; // on récupére la valeur contenu dans le bouton cliqué
        app.addNumbersCalculator(screenCalculator, selectedButton); // Call pour ajouter les valeurs numériques sur écran calculette
      });
    });
  },

  // ADD NUMBER FUNCTION
  addNumbersCalculator:(screenCalculator, selectedButton)=>{
    if(!screenCalculator.textContent){ // False, on met la valeur
      return screenCalculator.textContent=selectedButton;
    }else{ // True, on reprends ce qui est affiché et on ajoute la valeur
      return screenCalculator.textContent+=selectedButton;
    }
  },

  // CLICK OPERATOR BUTTONS FUNCTION FUNCTIONS EVENT
  clickButtonsOperatorCalculator:(buttonsOperatorCalculator, screenCalculator)=>{
    buttonsOperatorCalculator.forEach(btn => {// on écoute click sur chaque bouton opérateur
      btn.addEventListener("click", (e)=>{
        let operator; // Init var operator
        const regexOperator = /(\+|-|\x|\/)/; // Utilisation regex pour opérateur

        if(e.target.textContent.match(regexOperator)){ // Comparer si trouve un opérateur selon regex +, - x, /
          operator = e.target.textContent.match(regexOperator)[0];// on garde l'opérateur en mémoire
        }
        const selectedButton = e.target.textContent; // on garde la valeur en mémoire pour le bouton séledctionné

        // console.log(e.target.textContent);
        // console.log(operator);

        switch (selectedButton) { // multi-conditions

        case "DEL": // Si bouton DEL sélectionné
          app.deleteButtonsCalculator(screenCalculator); // Call fonction pour supprimé un "charactère" affiché dans l'écran.
          break; // fin
  
        case "RESET": // si bouton RESET sélectionné
          app.clearButtonsCalculator(screenCalculator); // Call fonction pour reset ce qui est affiché dans l'écran
          break; // fin
          
        case operator: // si un des boutons opérateur est sélectionné
          //console.log(operator);
          if(!screenCalculator.textContent){ // Si false, absence de valeur sur écran
            screenCalculator.textContent=""; // on fait rien
          }else if(!screenCalculator.textContent.includes(operator) && screenCalculator.textContent.search(regexOperator) === -1 ){ // si absence à l'écran d'un opérateur et on ne trouve pas d'autre opérateur
            app.firstValue=Number(screenCalculator.textContent); // on converse la première valeur
            screenCalculator.textContent=screenCalculator.textContent+operator;// on ajoute et affiche l'opérateur et première valeur
          }
          break; // fin

        case ".": // si bouton . selectionné
          if(!screenCalculator.textContent){ // si absence de valeur
            screenCalculator.textContent=""; // on ne fait rien
          }else if(!screenCalculator.textContent.includes(selectedButton)){
            screenCalculator.textContent=screenCalculator.textContent+selectedButton;
          }
          break; // fin
  
        case "=": // si bouton = selectionné
          if(!screenCalculator.textContent){// si absence de valeur
            screenCalculator.textContent=""; // on ne fait rien
          }else{

            const selectedOperatorToCacul = screenCalculator.textContent.match(regexOperator)[0]; // on recherche l'opérateur dans l'écran calculette et on conserve
            app.secondValue=Number(screenCalculator.textContent.slice(screenCalculator.textContent.indexOf(selectedOperatorToCacul)+1,screenCalculator.textContent.length));// on récupère la seconde valeur en identifiant la position de l'opérateur et la fin de chaine

            if(selectedOperatorToCacul==="+"){ // si on retrouve l'opérateur + 
              screenCalculator.textContent=app.sum(app.firstValue,app.secondValue); // call pour faire l'addition
            }

            if(selectedOperatorToCacul==="-"){ // si on retrouve l'opérateur -
              screenCalculator.textContent=app.substract(app.firstValue,app.secondValue); // call pour faire soustraction
            }

            if(selectedOperatorToCacul==="x"){ // si on retouve l'opérateur x
              screenCalculator.textContent=app.multiply(app.firstValue,app.secondValue);
            } // call pour faire multiplication

            if(selectedOperatorToCacul==="/"){ // si on retrouve l'opérateur /
              screenCalculator.textContent=app.divide(app.firstValue,app.secondValue);
            } // call pour faire division
          
          }
          // RaZ la première valeur et la seconde
          app.firstValue="";
          app.secondValue="";
          break; // fin

        }
      });
    });
  },

  // DELETE BUTTON FUNCTION 
  deleteButtonsCalculator:(screenCalculator)=>{ 
    if(screenCalculator.textContent.length > 0 && parseInt(screenCalculator.textContent,10)){ // si true, chaine de charactère affiché à l'écran et sup à 0 et ce sont des valeurs.
      return screenCalculator.textContent=screenCalculator.textContent.slice(0,screenCalculator.textContent.length-1); // on retire un charactère
    }else{
      return screenCalculator.textContent=""; // sinon, on ne fait rien
    }
  },

  // CLEAR BUTTON FUNCTION 
  clearButtonsCalculator:(screenCalculator)=>{
    //RaZ première valeur et seconde valeur
    screenCalculator.textContent="";
    app.firstValue="";
    app.secondValue="";
    return;
  }
  
};

// LAUNCH APP
app.init();