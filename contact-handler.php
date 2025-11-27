<?php
// Konfiguracja
$recipient_email = "kontakt@pro-serwis.pl"; // Zmień na rzeczywisty adres email
$subject_prefix = "[PRO-SERWIS] ";

// Nagłówki email
$headers = "From: noreply@pro-serwis.pl\r\n";
$headers .= "Reply-To: noreply@pro-serwis.pl\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Funkcja do czyszczenia danych wejściowych
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Sprawdź czy formularz został wysłany
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Pobierz i wyczyść dane z formularza
    $name = clean_input($_POST["name"]);
    $email = clean_input($_POST["email"]);
    $phone = clean_input($_POST["phone"]);
    $subject = clean_input($_POST["subject"]);
    $message = clean_input($_POST["message"]);
    
    // Walidacja danych
    $errors = array();
    
    if (empty($name)) {
        $errors[] = "Imię i nazwisko jest wymagane";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Poprawny adres email jest wymagany";
    }
    
    if (empty($message)) {
        $errors[] = "Wiadomość jest wymagana";
    }
    
    // Jeśli nie ma błędów, wyślij email
    if (empty($errors)) {
        
        // Przygotuj temat emaila
        $email_subject = $subject_prefix . "Nowa wiadomość od " . $name;
        if (!empty($subject)) {
            $email_subject .= " - " . $subject;
        }
        
        // Przygotuj treść emaila
        $email_body = "
        <html>
        <head>
            <title>Nowa wiadomość z formularza kontaktowego PRO-SERWIS</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f8fafc; padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #1e3a8a; }
                .value { color: #333; }
                .footer { background-color: #ea580c; color: white; padding: 15px; text-align: center; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Nowa wiadomość z formularza kontaktowego</h2>
                    <p><strong>PRO-SERWIS - Profesjonalny serwis urządzeń dźwignicowych</strong></p>
                </div>
                
                <div class='content'>
                    <div class='field'>
                        <div class='label'>Imię i nazwisko:</div>
                        <div class='value'>$name</div>
                    </div>
                    
                    <div class='field'>
                        <div class='label'>Email:</div>
                        <div class='value'>$email</div>
                    </div>
                    
                    <div class='field'>
                        <div class='label'>Telefon:</div>
                        <div class='value'>" . (!empty($phone) ? $phone : 'Nie podano') . "</div>
                    </div>
                    
                    <div class='field'>
                        <div class='label'>Temat:</div>
                        <div class='value'>" . (!empty($subject) ? $subject : 'Nie wybrano') . "</div>
                    </div>
                    
                    <div class='field'>
                        <div class='label'>Wiadomość:</div>
                        <div class='value'>$message</div>
                    </div>
                </div>
                
                <div class='footer'>
                    <p>Wiadomość wygenerowana automatycznie z formularza kontaktowego na stronie PRO-SERWIS</p>
                    <p>Data wysłania: " . date('d.m.Y H:i:s') . "</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        // Wyślij email
        if (mail($recipient_email, $email_subject, $email_body, $headers)) {
            // Odpowiedź sukcesu
            echo json_encode(array(
                'success' => true,
                'message' => 'Wiadomość została wysłana pomyślnie!'
            ));
        } else {
            // Błąd wysyłania
            echo json_encode(array(
                'success' => false,
                'message' => 'Wystąpił błąd podczas wysyłania wiadomości. Proszę spróbować ponownie.'
            ));
        }
        
    } else {
        // Odpowiedź z błędami walidacji
        echo json_encode(array(
            'success' => false,
            'message' => 'Proszę poprawić błędy w formularzu:',
            'errors' => $errors
        ));
    }
    
} else {
    // Jeśli nie jest to żądanie POST
    echo json_encode(array(
        'success' => false,
        'message' => 'Nieprawidłowe żądanie'
    ));
}
?>