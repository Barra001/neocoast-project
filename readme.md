# Cambios
## Conexión con mongoose
La conexión con el servidor es un proceso asíncrono por el cual la API debería esperar antes de comenzar a escuchar requests. Por lo tanto hay que agregar un `await` antes de `mongoose.connect(process.env.MONGO_URI);` y para eso tenemos que moverlo a una función asincronía.
## Creo un archivo `.env`
Creo un archivo `.env` para guardar todas las variables de entorno que no deberían estar harcodeadas por dos grandes razones. 

* Primero por seguridad, si estas variables son credenciales (como lo es el caso de `api_key`) y quedan harcodeadas, van a estar expuestas en el repositorio para que todos las vean.

> ⚠️ **Warning:** Para que se cumpla esto el archivo `.env` debe estar en el `.gitignore` 

* Segundo, mover estas variables a un archivo `.env` hace que puedan ser modificadas en producción sin necesidad de hacer un nuevo deploy.

Estas variables dependen del entorno en el que se corra el código, si dejamos `mongodb://localhost:27017/test` harcodeado como uri de la base de datos, cuando vayamos a deployar nuestra app no va a poder conectarse a mongodb ya que esta uri es solo util en un ambiente de desarrollo.


## Agrego un archivo `.gitignore`
Agrego un archivo `.gitignore` para no subir al repositorio ningún archivo o carpeta no deseada como `.env` o `node_modules`.

## Variable inutilizada
La variable "PRIVAVE_API_KEY" no se usa en ningún lado por lo tanto puede ser eliminada. 

## Variable `PORT`
La variable `PORT` nunca se define. Primero hay que definirla con `const` para luego poder utilizarla.

## GET endpoint
* No se hace un `try` y `catch` para asegurarse de en caso de no poder realizar la operación con éxito igualmente darle una respuesta informativa al usuario.

## "/create" endpoint
* Utilizando el método `POST` se sobreentiende que se esta creando un nuevo objeto en la base de datos y por lo tanto `/create` puede ser eliminado de la ruta.
* No se hace un `try` y `catch` para asegurarse de en caso de no poder realizar la operación de creación con éxito igualmente darle una respuesta informativa al usuario.
* La operación de crear una entidad es asincronía y debe terminar antes de enviarle al usuario su respuesta por eso hace falta un `await`.
## DELETE endpoint
* Como convención se utiliza el método `DELETE` y no `POST` a la hora de borrar una entidad. Realizando este cambio se puede sacar `/delete` de la ruta ya que ya se sobre entiende gracias al método.
* La función `delete` en el objeto `Post` no existe. Las opciones son `deleteOne` o `deleteMany`.
* No se hace un `try` y `catch` para asegurarse de en caso de no poder realizar la operación de borrado con éxito igualmente darle una respuesta informativa al usuario.
* Falta agregar `/:id` al final de la ruta para leer el id del post a eliminar

## Get by Id endpoint
* No se hace un `try` y `catch` para asegurarse de en caso de no poder realizar la operación con éxito igualmente darle una respuesta informativa al usuario.

## "/update" endpoint
* Como convención se utiliza el método `PUT` y no `POST` a la hora de actualizar una entidad. Realizando este cambio se puede sacar `/update` de la ruta ya que ya se sobre entiende gracias al método.
* No se hace un `try` y `catch` para asegurarse de en caso de no poder realizar la operación de actualización con éxito igualmente darle una respuesta informativa al usuario.
* La función `update` en el objeto `Post` no existe. Las opciones son `updateOne` o `updateMany`.

## EsLint
* El Proyecto no contaba con ningún linter para aplicar estilo al código y formatearlo automáticamente. Esto crea una base de código coherente y más legible.
## Desacoplar base de datos
* La base de datos se puede desacoplar de la lógica de la api express y ser llevada a su propio modulo de manera de separar responsabilidades, mantener un código mas cohesivo y hacerlo testeable por capas.

## GitHub Actions
* El proyecto tiene un workflow llamado `lint_and_test` que, en cualquier push a cualquier rama, ejecuta el linter y corre los tests. Esto es vital en un proceso de integración continua donde se puede introducir un bug en cualquier commit. Posibilita saber exactamente que commit es el responsable de introducir el bug que rompe los tests y asi poder solucionarlo rápidamente.

## Log de errores (cambio no implementado)
* En este momento los errores que da la API no se logean en ningún lado pero lo ideal es tener un sistema de logeo asíncrono en un servicio como NewRelic de manera de tener mayor visibilidad sobre lo que sucede con la API en todo momento.
