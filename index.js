// API Url for my cohort
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

// Sync state with the API and rerender
async function render() {
  await getParties();
  renderParties();
}
render();

// Update state with artists from API
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

// Render parties from state
function renderParties() {
  console.log(state.parties);
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventCards = state.parties.map((event) => {
    const date = new Date(event.date);
    const formatDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    const li = document.createElement("li");
    li.innerHTML = `
    <div>
        <h2>${event.name}</h2>
        <p>Date: ${formatDate}</p>
        <p>Location: ${event.location}</p>
        <p>Description: ${event.description}</p>
    </div>
    <button onclick="deleteParty('${event.id}')">Delete</button>
    `;
    return li;
  });

  partyList.replaceChildren(...eventCards);
}

// Ask the API to create a new prty based on form data
async function addParty(event) {
  event.preventDefault();

  const inputDate = addPartyForm.date.value;
  const date = new Date(inputDate + "T00:00:00");
  const fullDate = date.toISOString();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: fullDate,
        location: addPartyForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

render();
