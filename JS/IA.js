let isProcessing = false;
let firstInput = true;

async function loadJSON(path) {
  try{
    const res = await fetch(path);
    if (!res.ok){
      throw new Error(`${path} not found (${res.status})`);
    } 
    return await res.json();
  }catch{
    console.log("Error al cargar el JSON",error);
  }
}

function normalize(text) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

async function callOnlineAI(prompt) {
  const personality = `Responderas exclusivamente a temas relacionados con películas. Eso incluye:
                        Titulos de películas,sinopsis y tramas, actores,directores, personajes, 
                        recomendaciones por género, estilo o gusto, producciones basadas en libros, videojuegos, hechos reales, etc...,
                        fechas de estreno (solo de películas), curiosidades del mundo del cine.
                        No responderas preguntas que no esteén relacionadas con películas o series.
                        Si te preguntan cualquier cosa que se aparte de eso derivas la conversacion con un dato de
                        alguna película.`
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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", // ⚠️ Reemplaza con tu API KEY segura
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: personality},
        { role: "user", content: prompt }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`OpenRouter error ${res.status}:`, err);
    throw new Error("AI API error " + res.status);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response from AI.";
}

async function processInput() {
  if (isProcessing) {
    return;
  }
  isProcessing = true;
  const inputEl = document.getElementById("ia-input");
  const buttonEl = document.getElementById("ia-button");
  const output = document.getElementById("output-ia");

  inputEl.disabled = true;
  buttonEl.disabled = true;

  const userText = inputEl.value.trim();
  if (!userText) {
    resetUI();
    return;
  }

  if (firstInput) {
    inputEl.placeholder = "Ask about films";
    firstInput = false;
  }

  const youLine = document.createElement("div");
  youLine.innerHTML = `<strong>You:</strong> ${userText}`;
  output.appendChild(youLine);

  const botLine = document.createElement("div");
  botLine.innerHTML = `<strong>Bot:</strong> <span class="bot-reply">${"Procesando..."}</span>`;
  output.appendChild(botLine);

  output.scrollTop = output.scrollHeight;

  let reply = "";
  try {
    reply = await callOnlineAI(userText);
  } catch (err) {
    reply = "Error reaching AI.";
  }

  botLine.innerHTML = `<strong>Bot:</strong> <span class="bot-reply">${reply}</span>`;
  resetUI();
}

function resetUI() {
  document.getElementById("ia-input").value = "";
  document.getElementById("ia-input").disabled = false;
  document.getElementById("ia-button").disabled = false;
  isProcessing = false;
}

document.getElementById("ia-button").addEventListener("click", processInput);
