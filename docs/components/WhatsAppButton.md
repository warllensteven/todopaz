💬 WhatsApp Button (WhatsAppButton.tsx)
🧠 Descripción general

Este componente renderiza un botón que permite al usuario contactar directamente un negocio vía WhatsApp.

Es una pieza clave para la conversión, ya que:

📲 Abre una conversación directa con el negocio
⚡ Reduce fricción (1 clic)
💰 Facilita ventas/contacto inmediato
📦 Importaciones
'use client'
Importación Función
'use client' Permite ejecutar lógica en el navegador
🧩 Tipado de Props
type Props = {
phone: string
message?: string
}
Prop Tipo Descripción
phone string Número del negocio (obligatorio)
message string Mensaje personalizado (opcional)
🧩 Componente principal
export default function WhatsAppButton({ phone, message }: Props)
🚫 Validación inicial
if (!phone) return null
🔍 Qué hace:
Si no hay número → no renderiza nada
🎯 Beneficio:

✔ Evita errores
✔ Evita botones inútiles en UI

💬 Generación del mensaje
const waMsg = encodeURIComponent(
message || 'Hola, vi tu negocio en TodoPaz y me gustaría obtener más información.'
)
🔍 Qué hace:
Usa mensaje personalizado si existe
Si no → usa mensaje por defecto
encodeURIComponent convierte el texto a formato URL válido
🧠 Ejemplo:
Hola mundo → Hola%20mundo
🎯 Importante:

Sin esto, WhatsApp puede romper el link si hay espacios o caracteres especiales.

📞 Limpieza del número
const cleanPhone = phone.replace(/\D/g, '')
🔍 Qué hace:
Elimina todo lo que NO sea número
🧠 Ejemplo:
Entrada Resultado
+57 300-123-4567 573001234567
🎯 Beneficio:

✔ Evita errores en la URL
✔ Compatible con formato WhatsApp (wa.me)

🔗 URL de WhatsApp
href={`https://wa.me/${cleanPhone}?text=${waMsg}`}
🔍 Qué hace:

Construye el link oficial de WhatsApp:

https://wa.me/573001234567?text=Hola...
🎯 Resultado:

✔ Abre chat directo
✔ Precarga mensaje

🧱 Estructura del componente
<a>
<svg />
Texto

  <style jsx />
</a>
🎨 Botón principal
<a className="wa-btn">
🔍 Características:
target="_blank" → abre en nueva pestaña
rel="noopener noreferrer" → seguridad
🎯 UX:

✔ No saca al usuario de tu app
✔ Más seguro

🎯 Ícono SVG
<svg className="wa-icon">
🔍 Qué hace:
Renderiza el ícono de WhatsApp
Usa fill: currentColor → hereda color del botón
🎯 Beneficio:

✔ Ligero (sin imágenes externas)
✔ Escalable

🎨 Estilos (styled-jsx)
<style jsx>{` ... `}</style>

🔍 Qué hace:
CSS encapsulado SOLO para este componente
🎯 Beneficio:

✔ No contamina estilos globales
✔ Mantenible

🎨 Estilos principales
🟢 Botón
.wa-btn {
display: flex;
align-items: center;
justify-content: center;
}

✔ Centrado
✔ Responsive
✔ Espaciado consistente

✨ Hover (desktop)
.wa-btn:hover {
filter: brightness(1.1);
transform: translateY(-1px);
}

✔ Feedback visual
✔ Sensación de botón interactivo

👆 Click / Tap
.wa-btn:active {
transform: scale(0.98);
}

✔ Sensación de presión
✔ UX tipo app móvil

🔄 Flujo de ejecución
Usuario ve botón
↓
Hace clic
↓
Se genera URL wa.me
↓
Se abre WhatsApp
↓
Mensaje prellenado listo para enviar
🚀 Buenas prácticas aplicadas

✔ Validación de props
✔ Sanitización de datos (teléfono)
✔ Uso de encodeURIComponent
✔ Seguridad en enlaces externos
✔ Estilos encapsulados
✔ UX optimizada (hover + active)

⚠️ Mejores prácticas recomendadas (PRO)
🌍 Internacionalización

Permitir mensajes dinámicos por idioma:

const defaultMsg = {
es: 'Hola...',
en: 'Hello...',
}
📊 Tracking (MUY PRO)

Medir clics:

onClick={() => track('whatsapp_click')}
📱 Mejora UX

Detectar dispositivo:

Mobile → abrir app
Desktop → abrir WhatsApp Web
🔐 Validación avanzada
if (cleanPhone.length < 10) return null
🎨 Reutilización

Convertir en botón genérico:

<SocialButton type="whatsapp" />
📈 Resumen de mejoras
Se documentó el sistema de contacto vía WhatsApp
Se explicó la construcción del link wa.me
Se detalló la sanitización del teléfono
Se explicó el uso de encodeURIComponent
Se documentó el uso de estilos encapsulados
Se incluyeron mejoras de UX y seguridad
Se dejaron bases para tracking y escalabilidad
