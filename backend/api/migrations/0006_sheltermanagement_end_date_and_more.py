# Generated by Django 5.1.7 on 2025-04-21 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_sheltermanagement_admin_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='sheltermanagement',
            name='end_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sheltermanagement',
            name='start_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
