'''
typing es un modulo que proporciona soporte para tipos de datos en Python.

'''

from typing import Any
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.contrib.auth.models import UserManager
from django.utils import timezone

class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email) # normaliza el email a minusculas
        user = self.model(email=email, **extra_fields) # crea un usuario con el email y los campos extra
        user.set_password(password) # setea la contraseña del usuario 
        user.save(using=self._db) # guarda el usuario en la base de datos
        return user
    
    # aqui se crea un usuario con el email y la contraseña 
    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)
        # aqui se llama a la funcion _create_user con los parametros email y password
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # aqui se llama a la funcion _create_user con los parametros email y password
        return self._create_user(email, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(blank=True, default='', unique=True)
    name = models.CharField(max_length=255, blank=True, default='')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default = timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        return self.name
    
    def get_short_name(self):
        return self.name or self.email.split('@')[0]