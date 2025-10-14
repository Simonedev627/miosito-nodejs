
<?php
// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Percorso corretto usando __DIR__
require __DIR__ . '/PHPMailer-6.10.0/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-6.10.0/src/SMTP.php';
require __DIR__ . '/PHPMailer-6.10.0/src/Exception.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nome = strip_tags(trim($_POST["nome"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $messaggio = trim($_POST["messaggio"]);

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'esposito.francesco1890@gmail.com'; // la tua email
        $mail->Password   = 'pincgzvcdihuemjo';      // password o app password
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom($email, $nome);
        $mail->addAddress('tuamail@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = 'Nuovo messaggio dal sito web';
        $mail->Body    = "<strong>Nome:</strong> $nome<br>
                          <strong>Email:</strong> $email<br>
                          <strong>Messaggio:</strong><br>$messaggio";
        $mail->AltBody = "Nome: $nome\nEmail: $email\nMessaggio:\n$messaggio";

        $mail->send();
        echo "Messaggio inviato con successo!";
    } catch (Exception $e) {
        echo "Messaggio non inviato. Errore: {$mail->ErrorInfo}";
    }
}
?>