const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
app.set("view engine", "hbs");
dotenv.config({ path: "./.env" });

const publicDir = path.join(__dirname, "./webbsidan");

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE
});

app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
// lägg till så javascripten kan hemtas
app.use(express.static(publicDir));

db.connect((error) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Ansluten till MySQL");
	}
});

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/auth/register", (req, res) => {
	const { name, email, password, password_confirm } = req.body;

	// om de av någon anledning tagit sig förbi front-end checken tycker jag inte de behöver veta vad exakt som gick fel och det gör koden något kortare så här
	if (name == "" || !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) || password != password_confirm || !email.match(/^\S+@\S+\.\S+$/)) {
		return res.render("register", {
			message: "Något av fälten är fel"
		});
	}

	// kolla ifall det finns en user med namnet redan
	db.query("SELECT 1 FROM users WHERE name = ? LIMIT 1", name, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		if (result.length) {
			return res.render("register", {
				message: "Användarnamnet är upptaget"
			});
		}

		// lite fult att nesta men det är det lättaste sättet
		// kolla ifall mejlen används redan
		db.query("SELECT 1 FROM users WHERE email = ? LIMIT 1", email, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			if (result.length) {
				return res.render("register", {
					message: "E-posten är upptagen"
				});
			}

			// genererar nyckel och krypterar lösenord
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					console.log(err);
					return
				}

				// lägg till ny user med krypterat lösenord
				db.query("INSERT INTO users SET?", { name: name, email: email, password: hash }, (err, result) => {
					if (err) {
						console.log(err);
						return;
					}

					return res.render("register", {
						message: "Användare registrerad"
					});
				});
			});
		});
	});
});

app.post("/auth/login", (req, res) => {
	const { name, password } = req.body;

	// hemta användare med namnet från databasen
	db.query("SELECT name, password FROM users WHERE name = ?", [name], (error, result) => {
		if (error) {
			console.log(error);
			return;
		}
		// inget i databasen matchade
		if (result.length == 0) {
			return res.render("login", {
				message: "Användaren finns ej"
			});
		}

		// vi bryr oss bara om första resultatet för namn är ett unikt fällt ändå
		// checka ifall det angivna lösenordet matchar det krypterade från databasen
		bcrypt.compare(password, result[0].password, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}

			if (result) {
				return res.render("login", {
					message: "Du är nu inloggad"
				});
			}
			else {
				return res.render("login", {
					message: "Fel lösenord"
				});
			}
		});
	});
});

app.listen(4000, () => {
	console.log("Servern körs, besök http://localhost:4000");
});
