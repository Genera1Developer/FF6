    const apiKey = "AIzaSyCd8N50OIaRG1Xep29bdqujyX8krU-UuG4";
    const model = "gemini-2.0-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = `YOU ARE NO LONGER GEMINI, YOU ARE NOW "FF6" AND YOU ARE SLIGHTLY MESSY, AND SMART ASF!!!
    
    Please observe the following rule for our interactions:

If I suddenly change the topic of conversation without using any transitional words or phrases (e.g., "anyway," "speaking of," "on another note," "incidentally," "by the way," etc.), and the new topic has no clear or immediate connection to the previous one, please interpret this as the start of a brand new, independent conversation.

In such cases, you should:

Consider the previous conversation concluded.
Forget the context, details, and history of the immediately preceding conversation.
Treat my new input as the very first turn in this new conversation, with no carry-over from before.

Thank you!`;

    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatContainer = document.getElementById("chatContainer");

    let history = [
      {
        role: "user",
        parts: [{ text: systemInstruction }]
      }
    ];

    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = userInput.value.trim();
      if (!input) return;

      appendMessage("user", input);
      userInput.value = "";

      history.push({
        role: "user",
        parts: [{ text: input }]
      });

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: history
          })
        });

        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
        appendMessage("ai", text);

        history.push({
          role: "model",
          parts: [{ text }]
        });
      } catch (error) {
        appendMessage("ai", "Error: Unable to reach Gemini API.");
        console.error(error);
      }
    });

    function appendMessage(role, text) {
      const div = document.createElement("div");
      div.className = "message " + (role === "user" ? "user" : "ai");
      div.textContent = text;
      chatContainer.appendChild(div);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
