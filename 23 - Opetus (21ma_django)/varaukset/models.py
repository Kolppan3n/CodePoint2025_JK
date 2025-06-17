from django.db import models
from tilat.models import Tila
from varaajat.models import Varaaja

class Varaus(models.Model):
    tila = models.ForeignKey(Tila, on_delete=models.CASCADE)
    varaaja = models.ForeignKey(Varaaja, on_delete=models.CASCADE)
    varauspaiva = models.DateField()