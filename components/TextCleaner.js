"use client";

import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
`;

const OutputContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  height: 500px;
  max-height: 500px;
  width: 400px; /* Set a fixed width */
  overflow-y: auto;
  word-wrap: break-word; /* Ensure long words break to avoid expanding the container */
  white-space: pre-wrap; /* Preserve whitespace and wrap text as needed */
  overflow-wrap: break-word; /* Break long words */
`;

const PersonLabel = styled.span`
  font-weight: bold;
  color: #333;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 16px;
  width: 100%;
  height: 200px; /* Set height as needed */
  resize: vertical; /* Allow vertical resizing */
  box-sizing: border-box;
`;

const PersonsBox = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const CensorBox = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Section = styled.section`
  flex: 1;
  margin: 0 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

const NameSpan = styled.span`
  font-weight: bold;
  margin-top: 16px; /* Add margin-top to distinguish names */
  display: block;
`;

const MiddleBox = styled.div`
  border: 2px solid #333;
  background-color: #f0f0f0;
  padding: 20px;
  margin-bottom: 20px;
`;

const AddPersonButton = styled(Button)`
  margin-top: 0px;
  width: 100%;
`;

const CensorButton = styled(Button)`
  margin-top: 0px;
  width: 100%;
`;

const CopyButton = styled(Button)`
  width: 100%;
`;

const TextCleaner = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [replacements, setReplacements] = useState([
    { label: "Person A:", name: "" },
  ]);
  const [showCensorInput, setShowCensorInput] = useState(false);
  const [censorWords, setCensorWords] = useState([]);

  const addCensorWord = () => {
    if (censorWords.length < 10) {
      // Limiting to 10 censor words
      setCensorWords([...censorWords, ""]); // Add one empty string
      setShowCensorInput(true); // Ensure the input field is shown
    }
  };

  const handleNameChange = (index, value) => {
    const newReplacements = [...replacements];
    newReplacements[index].name = value.trim() !== "" ? value : ""; // Update only if value is not empty
    setReplacements(newReplacements);
  };

  const addPerson = () => {
    const newLabel = `Person ${String.fromCharCode(65 + replacements.length)}:`;
    const newName = ""; // Initialize with empty string
    setReplacements([...replacements, { label: newLabel, name: newName }]);
  };

  const toggleCensorInput = () => {
    setShowCensorInput(!showCensorInput);
  };

  const handleCensorWordChange = (index, value) => {
    const newCensorWords = [...censorWords];
    newCensorWords[index] = value;
    setCensorWords(newCensorWords);
  };

  const cleanText = () => {
    let text = inputText;

    // Replace names
    replacements.forEach(({ label, name }) => {
      if (name.trim() !== "") {
        const regex = new RegExp(`(^|\\b)${name}(\\b|$)`, "gi");
        text = text.replace(regex, label.slice(0, -1));
      }
    });

    // Apply censoring for each censor word
    censorWords.forEach((word) => {
      if (word.trim() !== "") {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        text = text.replaceAll(regex, "[REDACTED]");
      }
    });

    // Remove timestamps and ensure no empty <div> elements are created
    text = text.replace(/\b\d{1,2}:\d{2} ?(?:AM|PM)?\b/g, "");

    // Remove extra newlines resulting from empty timestamp replacement
    text = text.replace(/\n{2,}/g, "\n");

    setOutputText(text);
  };

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  return (
    <Container>
      <ContentWrapper>
        <Title>Text Cleaner</Title>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Section>
            <TextArea
              rows="10"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </Section>
          <Section>
            <MiddleBox>
              {replacements.map((replacement, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block" }}>
                    <PersonLabel>{replacement.label}</PersonLabel>
                    <StyledInput
                      type="text"
                      value={replacement.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                    />
                  </label>
                </div>
              ))}
              <AddPersonButton onClick={addPerson}>
                + Add Person
              </AddPersonButton>
            </MiddleBox>
            <MiddleBox>
              <CensorBox show={showCensorInput}>
                {censorWords.map((word, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <StyledInput
                      type="text"
                      value={word}
                      onChange={(e) =>
                        handleCensorWordChange(index, e.target.value)
                      }
                      placeholder={`Censor Word ${index + 1}`}
                    />
                  </div>
                ))}
              </CensorBox>
              <CensorButton onClick={addCensorWord}>+ Censor Word</CensorButton>
            </MiddleBox>
            <Button
              style={{ width: "100%", background: "#000080" }}
              onClick={cleanText}
            >
              Clean Text
            </Button>
            <CopyButton onClick={copyTextToClipboard}>
              Copy Formatted Text
            </CopyButton>
          </Section>
          <Section style={{ position: "relative" }}>
            <OutputContainer>
              {outputText && (
                <pre>
                  {outputText.split("\n").map((line, index) => (
                    <div key={index}>
                      {line.trim().startsWith("Person") ? (
                        <NameSpan>{line}</NameSpan>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </pre>
              )}
            </OutputContainer>
          </Section>
        </div>
      </ContentWrapper>
    </Container>
  );
};

export default TextCleaner;
