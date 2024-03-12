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
	const email = form["email"].value;
	const password = form["password"].value;
	const password_confirm = form["password_confirm"].value;

	let valid = true;

	// checka saker innan det går till sevrern. Error texterna förklarar det mesta
	if (name == "") {
		valid = false;
		createError("Namn kan inte vara tomt");
	}
	// finns mer omfattande regex email-checks men det är good enough
	if (!email.match(/^\S+@\S+\.\S+$/)) {
		valid = false;
		createError("E-posten är inte giltig")
	}
	// regex från stackoverflow. ser ut att fungera
	if (!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
		valid = false;
		createError("Lösenordet måste innehålla minst 8 tecken varav minst en stor bokstav, en liten, en siffra och ett specialtecken");
	}
	if (password != password_confirm) {
		valid = false;
		createError("Lösenorden matchar inte");
	}

	// stoppar posten om valid är false
	return valid;
}