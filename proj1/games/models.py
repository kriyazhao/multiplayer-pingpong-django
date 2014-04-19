from django.db import models

# Create your models here.
class User(models.Model):
	first_name = models.CharField(max_length = 20)
	last_name = models.CharField(max_length = 20)
	email = models.EmailField()
class Game(models.Model):
	users = models.ManyToManyField(User)
	game_win = models.CharField(max_length = 40)
	game_date = models.DateField()
	