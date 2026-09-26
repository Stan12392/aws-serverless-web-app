import { Amplify } from "aws-amplify";
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient();

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const authMessage = document.getElementById("authMessage");
const appSection = document.getElementById("app-section");
const notesList = document.getElementById("notesList");
const noteInput = document.getElementById("noteInput");

function showMessage(text) {
  authMessage.textContent = text;
}

async function loadNotes() {
  notesList.innerHTML = "";
  const { data: notes, errors } = await client.models.Note.list();
  if (errors?.length) {
    showMessage(errors[0].message);
    return;
  }
  for (const note of notes) {
    const li = document.createElement("li");
    li.textContent = note.content;
    notesList.appendChild(li);
  }
}

async function refreshAuth() {
  try {
    await getCurrentUser();
    appSection.hidden = false;
    showMessage("Signed in");
    await loadNotes();
  } catch {
    appSection.hidden = true;
    showMessage("Not signed in");
  }
}

document.getElementById("signUpBtn").addEventListener("click", async () => {
  try {
    await signUp({
      username: emailEl.value,
      password: passwordEl.value,
      options: { userAttributes: { email: emailEl.value } },
    });
    showMessage("Sign up OK. Enter the email code, then Confirm.");
  } catch (err) {
    showMessage(err.message || "Sign up failed");
  }
});

document.getElementById("confirmBtn").addEventListener("click", async () => {
  try {
    await confirmSignUp({
      username: emailEl.value,
      confirmationCode: document.getElementById("code").value,
    });
    showMessage("Email confirmed. Now click Sign in.");
  } catch (err) {
    showMessage(err.message || "Confirm failed");
  }
});

document.getElementById("signInBtn").addEventListener("click", async () => {
  try {
    await signIn({ username: emailEl.value, password: passwordEl.value });
    await refreshAuth();
  } catch (err) {
    showMessage(err.message || "Sign in failed");
  }
});

document.getElementById("signOutBtn").addEventListener("click", async () => {
  await signOut();
  await refreshAuth();
});

document.getElementById("saveNoteBtn").addEventListener("click", async () => {
  const content = noteInput.value.trim();
  if (!content) return;
  const { errors } = await client.models.Note.create({ content });
  if (errors?.length) {
    showMessage(errors[0].message);
    return;
  }
  noteInput.value = "";
  await loadNotes();
});

document.getElementById("quoteBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    document.getElementById("quote").textContent =
      data.content + " — " + data.author;
  } catch {
    document.getElementById("quote").textContent = "Could not load quote";
  }
});

refreshAuth();