# Generated by Django 5.0.6 on 2024-06-12 04:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0017_inventario_y_stock_nombre_prov'),
    ]

    operations = [
        migrations.RenameField(
            model_name='inventario_y_stock',
            old_name='nombre_prov',
            new_name='nombre_provv',
        ),
    ]
