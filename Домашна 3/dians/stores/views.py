from django.shortcuts import render
from .models import Store
from django.core import serializers
import json
from django.http import JsonResponse


# Create your views here.
def index(request):
    stores = Store.objects.all()
    return render(request, 'stores/index.html', {'stores': stores})


def get_stores(request):
    stores = Store.objects.all()
    stores_dict={
        "stores": []
    }
    for store in stores:
        stores_dict["stores"].append({
            "address": store.address,
            "municipality": store.municipality,
            "name": store.name,
            "number": store.number,
            "lat": store.lat,
            "long": store.long,
        })
    data= json.dumps(stores_dict)
    return JsonResponse(stores_dict)
