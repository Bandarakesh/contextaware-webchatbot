document.getElementById("askBtn").addEventListener("click", async () => {
    try {
      // Get the active tab in the current window
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script to get page text
      chrome.tabs.sendMessage(tab.id, { action: "getPageText" }, async (response) => {
        if (!response || !response.text) {
          document.getElementById("answer").innerText = "Failed to get page content.";
          return;
        }
  
        const pageText = response.text;
        const question = document.getElementById("questionInput").value;
  
        // Call backend API with error handling
        try {
          const res = await fetch("http://127.0.0.1:5000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context: pageText, question: question }),
          });
  
          if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
          }
  
          const data = await res.json();
          document.getElementById("answer").innerText = data.answer || "No answer received.";
        } catch (fetchError) {
          document.getElementById("answer").innerText = `Error fetching answer: ${fetchError.message}`;
        }
      });
    } catch (error) {
      document.getElementById("answer").innerText = `Unexpected error: ${error.message}`;
    }
  });
  