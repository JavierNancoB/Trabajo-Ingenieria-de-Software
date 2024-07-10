# authuser/validators.py

from django.core.exceptions import ValidationError
import re

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if not re.findall(r'(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]', password):
            raise ValidationError(
                'La contraseña debe contener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un símbolo.'
            )

    def get_help_text(self):
        return 'La contraseña debe contener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un símbolo.'
