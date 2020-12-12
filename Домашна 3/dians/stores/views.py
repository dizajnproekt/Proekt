from django.shortcuts import render
from .models import Store


# Create your views here.
def index(request):
    stores = Store.objects.all()
    return render(request, 'stores/index.html', {'stores': stores})
