from rest_framework import serializers
from .models import Kayttaja

class KayttajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kayttaja
        fields = ['id', 'nimi', 'tunnus', 'rooli']  # Ei salasanaa!