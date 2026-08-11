import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const INICIAL = { nombreEquipo: '', nombreCapitan: '', email: '', telefono: '', categoria: '' };

function CampoFormulario({ etiqueta, error, ...props }) {
  return <View style={styles.grupo}>
    <Text style={styles.etiqueta}>{etiqueta}</Text>
    <TextInput {...props} style={[styles.input, error && styles.inputError]} placeholderTextColor="#7e8497" />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

function validar(datos) {
  const errores = {};
  const equipo = datos.nombreEquipo.trim();
  if (!equipo) errores.nombreEquipo = 'El nombre del equipo es obligatorio.';
  else if (equipo.length < 3 || equipo.length > 20) errores.nombreEquipo = 'Debe tener entre 3 y 20 caracteres.';
  if (!datos.nombreCapitan.trim()) errores.nombreCapitan = 'El nombre del capitán es obligatorio.';
  if (!datos.email.trim()) errores.email = 'El email es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) errores.email = 'Ingresá un email válido (nombre@dominio.com).';
  if (!datos.telefono.trim()) errores.telefono = 'El teléfono es obligatorio.';
  else if (!/^\d+$/.test(datos.telefono.trim())) errores.telefono = 'El teléfono solo puede contener números.';
  if (!datos.categoria.trim()) errores.categoria = 'Elegí una categoría.';
  return errores;
}

export default function App() {
  const [formulario, setFormulario] = useState(INICIAL);
  const errores = validar(formulario);
  const hayErrores = Object.keys(errores).length > 0;
  const cambiar = (campo, valor) => setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  const confirmar = () => {
    if (!hayErrores) Alert.alert('¡Inscripción confirmada!', `${formulario.nombreEquipo.trim()} ya participa de la Copa Valorant.`);
  };

  return <View style={styles.pantalla}>
    <StatusBar style="light" /><View style={styles.brillo} />
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.encabezado}>
          <Text style={styles.copa}>VALORANT • COPA 2026</Text>
          <Text style={styles.titulo}>Inscribí a tu equipo</Text>
          <Text style={styles.subtitulo}>Completá los datos para asegurar un lugar en la competencia.</Text>
        </View>
        <View style={styles.tarjeta}>
          <CampoFormulario etiqueta="Nombre del equipo" placeholder="Ej. Los Radiantes" value={formulario.nombreEquipo} onChangeText={(v) => cambiar('nombreEquipo', v)} keyboardType="default" autoCapitalize="words" error={errores.nombreEquipo} />
          <CampoFormulario etiqueta="Nombre del capitán" placeholder="Nombre y apellido" value={formulario.nombreCapitan} onChangeText={(v) => cambiar('nombreCapitan', v)} keyboardType="default" autoCapitalize="words" error={errores.nombreCapitan} />
          <CampoFormulario etiqueta="Email" placeholder="equipo@ejemplo.com" value={formulario.email} onChangeText={(v) => cambiar('email', v)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={errores.email} />
          <CampoFormulario etiqueta="Teléfono" placeholder="Ej. 1145678901" value={formulario.telefono} onChangeText={(v) => cambiar('telefono', v)} keyboardType="phone-pad" error={errores.telefono} />
          <View style={styles.grupo}>
            <Text style={styles.etiqueta}>Categoría</Text>
            <View style={styles.categorias}>
              {['Sub-16', 'Libre'].map((categoria) => {
                const activa = formulario.categoria === categoria;
                return <Pressable key={categoria} onPress={() => cambiar('categoria', categoria)} accessibilityRole="button" accessibilityState={{ selected: activa }} style={({ pressed }) => [styles.toggle, activa && styles.toggleActivo, pressed && styles.presionado]}>
                  <Text style={[styles.toggleTexto, activa && styles.toggleTextoActivo]}>{categoria}</Text>
                </Pressable>;
              })}
            </View>
            {errores.categoria ? <Text style={styles.error}>{errores.categoria}</Text> : null}
          </View>
          <Pressable disabled={hayErrores} onPress={confirmar} accessibilityRole="button" accessibilityState={{ disabled: hayErrores }} style={({ pressed }) => [styles.confirmar, hayErrores && styles.deshabilitado, pressed && styles.presionado]}>
            <Text style={[styles.confirmarTexto, hayErrores && styles.deshabilitadoTexto]}>Confirmar inscripción</Text>
          </Pressable>
        </View>
        <Text style={styles.pie}>CUPOS LIMITADOS • INSCRIPCIÓN GRATUITA</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, pantalla: { flex: 1, backgroundColor: '#0b1020' },
  brillo: { position: 'absolute', top: -110, right: -90, width: 280, height: 280, borderRadius: 140, backgroundColor: '#6548e8', opacity: 0.35 },
  contenido: { flexGrow: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 54 : 70, paddingBottom: 32 },
  encabezado: { width: '100%', maxWidth: 560, alignSelf: 'center', marginBottom: 24 },
  copa: { color: '#a998ff', fontSize: 12, fontWeight: '800', letterSpacing: 1.8, marginBottom: 10 },
  titulo: { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: -0.8, marginBottom: 10 },
  subtitulo: { color: '#b9c0d4', fontSize: 15, lineHeight: 22 },
  tarjeta: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 20, borderRadius: 22, backgroundColor: '#f7f8fc' },
  grupo: { marginBottom: 17 }, etiqueta: { color: '#252a3b', fontSize: 14, fontWeight: '700', marginBottom: 7 },
  input: { height: 50, paddingHorizontal: 14, borderWidth: 1.5, borderColor: '#dfe2ea', borderRadius: 12, backgroundColor: '#fff', color: '#161a28', fontSize: 16 },
  inputError: { borderColor: '#d83d59', backgroundColor: '#fff9fa' },
  error: { color: '#c92f4c', fontSize: 12, fontWeight: '600', lineHeight: 17, marginTop: 5 },
  categorias: { flexDirection: 'row', gap: 10 },
  toggle: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#dfe2ea', borderRadius: 12, backgroundColor: '#fff' },
  toggleActivo: { borderColor: '#6548e8', backgroundColor: '#6548e8' },
  toggleTexto: { color: '#474d60', fontSize: 15, fontWeight: '700' }, toggleTextoActivo: { color: '#fff' },
  confirmar: { height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#6548e8', marginTop: 4 },
  deshabilitado: { backgroundColor: '#dfe1e8' }, confirmarTexto: { color: '#fff', fontSize: 16, fontWeight: '800' },
  deshabilitadoTexto: { color: '#8c91a0' }, presionado: { opacity: 0.82 },
  pie: { color: '#747e99', fontSize: 10, fontWeight: '800', letterSpacing: 1.4, textAlign: 'center', marginTop: 20 },
});