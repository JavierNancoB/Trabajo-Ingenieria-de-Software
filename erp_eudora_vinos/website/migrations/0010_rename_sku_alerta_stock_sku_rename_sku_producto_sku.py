# Generated by Django 5.0.5 on 2024-05-31 01:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0009_remove_producto_fecha_fabricacion'),
    ]

    operations = [
        migrations.RenameField(
            model_name='alerta_stock',
            old_name='SKU',
            new_name='sku',
        ),
        migrations.RenameField(
            model_name='producto',
            old_name='SKU',
            new_name='sku',
        ),
    ]
