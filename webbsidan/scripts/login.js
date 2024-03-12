// lägg till ett felmeddelande i botten av sidan
function createError(text) {
	const err = document.createElement("h4");
	err.innerText = text;
	err.classList.add("alert", "alert-danger", "mt-4");
	document.body.appendChild(err);
}

// onsubmit verifiering
function validateForm() {
	// ta bort alla tidigare felmeddelanden innan nya kanske printas
	document.querySelectorAll(".alert").forEach(e => e.remove());

	// läs alla värden
	const form = document.forms[0];
	const name = form["name"].value;
	const password = form["password"].value;

	let valid = true;

	// det finns inte så mycket att checka här innan servern med det är bättre än inget
	if (name == "") {
		valid = false;
		createError("Namn kan inte vara tomt");
	}
	if (password == "") {
		valid = false;
		createError("Lösenord kan inte vara tomt");
	}

	// stoppar posten om valid är false
	return valid;
}