from django import forms
from .models import Producto
#formulario para productos
class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = '__all__'