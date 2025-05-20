// EmailJS configuration for contact form
document.addEventListener("DOMContentLoaded", function () {
    // Initialize EmailJS with your public key
    emailjs.init("proQG-kKXyAob4c0l");
    console.log('EmailJS initialized with public key');
    
    const form = document.getElementById("contact-form");
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Store original button text and show loading state
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Get reCAPTCHA response if it exists
        let recaptchaResponse = "";
        if (typeof grecaptcha !== 'undefined') {
            recaptchaResponse = grecaptcha.getResponse();
            
            // Validate reCAPTCHA if it exists on the page
            if (document.querySelector('.g-recaptcha') && !recaptchaResponse) {
                alert('Please complete the reCAPTCHA verification.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }
        }
        
        // Send the form using EmailJS
        emailjs.sendForm("service_g1fl49c", "template_c9awl4s", form)
            .then(function(response) {
                console.log("SUCCESS!", response.status, response.text);
                
                // Reset form and reCAPTCHA if it exists
                form.reset();
                if (typeof grecaptcha !== 'undefined' && document.querySelector('.g-recaptcha')) {
                    grecaptcha.reset();
                }
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Show success message
                alert("Thank you! Your message was sent successfully. We'll get back to you soon.");
            })
            .catch(function(error) {
                console.error("EmailJS error:", error);
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Show error message
                alert("Something went wrong. Please try again later or email us directly at support@liveplan3.com");
            });
    });
});
