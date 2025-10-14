<?php
echo "PHP funziona correttamente!<br>";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST["nome"] ?? "non inserito";
    $email = $_POST["email"] ?? "non inserito";
    $messaggio = $_POST["messaggio"] ?? "non inserito";

    echo "Hai inviato i seguenti dati:<br>";
    echo "Nome: $nome <br>";
    echo "Email: $email <br>";
    echo "Messaggio: $messaggio <br>";
}