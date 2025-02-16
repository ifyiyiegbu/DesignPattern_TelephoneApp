// Function to log messages to the page
function log(message) {
    const logDiv = document.getElementById("log");
    const msgElem = document.createElement("div");
    msgElem.textContent = message;
    logDiv.appendChild(msgElem);
    logDiv.scrollTop = logDiv.scrollHeight;
  }
  
  function clearLog() {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML = '';
  }

  // Override console.log so messages also appear in our log area
  (function() {
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      args.forEach(arg => log(arg));
    }
  })();
  
  class ContactListObserver {
    constructor() {
      this.updates = [];
    }
  
    update(payload) {
      if (payload.event === 'contact') {
        this.updates.push(payload);
        console.log(`Contact list updated: ${payload.name} ${payload.action} (${payload.number})`);
      }
    }
  }
  
  class PrintPhoneNumberObserver {
    update(payload) {
      if (payload.event === 'dial') {
        console.log(`Print: ${payload.number}`);
      }
    }
  }
  
  class DialingPhoneNumberObserver {
    update(payload) {
      if (payload.event === 'dial') {
        console.log(`Now Dialing ${payload.number}`);
      }
    }
  }
  
  // Telephone class with observer pattern
  class Telephone {
    constructor() {
      this.contactList = new Map();
      this.observers = [];
    }
  
    addObserver(observer) {
      this.observers.push(observer);
    }
  
    deleteObserver(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
    }
  
    notifyObservers(payload) {
      this.observers.forEach(observer => observer.update(payload));
    }
  
    AddPhoneNumber(name, number) {
      if (this.contactList.has(name)) {
        console.log(`${name} already exists in the contact list.`);
      } else {
        this.contactList.set(name, number);
        console.log(`${name} has been added to the contact list.`);
        this.notifyObservers({ event: 'contact', name, number, action: 'added' });
      }
    }
  
    RemovePhoneNumber(name) {
      if (this.contactList.has(name)) {
        const number = this.contactList.get(name);
        this.contactList.delete(name);
        console.log(`${name}'s phone number removed from the contact list.`);
        this.notifyObservers({ event: 'contact', name, number, action: 'deleted' });
      } else {
        console.log(`${name} does not exist in the contact list.`);
      }
    }
  
    DialPhoneNumber(name) {
      if (this.contactList.has(name)) {
        const number = this.contactList.get(name);
        this.notifyObservers({ event: 'dial', number });
      } else {
        console.log(`${name} does not exist in the contact list.`);
      }
    }
  }
  
  // Instantiate Telephone and observers
  const phone = new Telephone();
  const contactObserver = new ContactListObserver();
  const printObserver = new PrintPhoneNumberObserver();
  const dialingObserver = new DialingPhoneNumberObserver();
  
  phone.addObserver(contactObserver);
  phone.addObserver(printObserver);
  phone.addObserver(dialingObserver);
  
  // Event listeners 
  document.getElementById("addButton").addEventListener("click", () => {
    const name = document.getElementById("addName").value.trim();
    const number = document.getElementById("addNumber").value.trim();
    if (name && number) {
      phone.AddPhoneNumber(name, number);
    } else {
      console.log("Please enter both a name and a number.");
    }
   
  });
  
  document.getElementById("removeButton").addEventListener("click", () => {
    const name = document.getElementById("removeName").value.trim();
    if (name) {
      phone.RemovePhoneNumber(name);
    } else {
      console.log("Please enter a name to remove.");
    }
  });
  
  document.getElementById("dialButton").addEventListener("click", () => {
    const name = document.getElementById("dialName").value.trim();
    if (name) {
      phone.DialPhoneNumber(name);
    } else {
      console.log("Please enter a name to dial.");
    }
  });
  
  document.getElementById("clearLogButton").addEventListener("click", clearLog);
