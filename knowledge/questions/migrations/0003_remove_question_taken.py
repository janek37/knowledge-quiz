# Generated by Django 2.2.2 on 2019-10-06 20:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_auto_20191006_2050'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='taken',
        ),
    ]
