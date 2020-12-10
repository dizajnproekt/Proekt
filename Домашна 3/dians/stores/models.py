from django.db import models


# Create your models here.
class Store(models.Model):
    address = models.CharField(max_length=256)
    municipality = models.CharField(max_length=256)
    name = models.CharField(max_length=256)
    number = models.CharField(max_length=256)
    lat = models.FloatField()
    long = models.FloatField()