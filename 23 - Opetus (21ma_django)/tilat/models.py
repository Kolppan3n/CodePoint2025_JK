from django.db import models

class Tila(models.Model):
    nimi = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nimi