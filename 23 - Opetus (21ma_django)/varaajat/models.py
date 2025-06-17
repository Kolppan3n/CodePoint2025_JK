from django.db import models

class Varaaja(models.Model):
    nimi = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nimi