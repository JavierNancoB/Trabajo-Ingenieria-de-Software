from django import forms
from .models import Producto

class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = ['SKU', 'tipo_producto', 'viña', 'cepa', 'nombre_producto', 'cosecha']