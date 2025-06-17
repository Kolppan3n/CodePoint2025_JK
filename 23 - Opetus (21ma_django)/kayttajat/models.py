from django.db import models
from django.contrib.auth.models import AbstractUser

class Kayttaja(AbstractUser):
    rooli = models.CharField(max_length=20, choices=[
        ('admin', 'Ylläpitäjä'),
        ('user', 'Käyttäjä'),
    ])