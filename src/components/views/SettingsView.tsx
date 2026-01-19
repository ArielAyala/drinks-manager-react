import { useState } from 'react';
import { Trash2, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, Button, Modal } from '../ui';
import { useClearAllData } from '../../hooks/useLocalStorage';
import packageJson from '../../../package.json';

export function SettingsView() {
  const clearAllData = useClearAllData();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClearData = () => {
    clearAllData();
    setShowConfirmModal(false);
    window.location.reload();
  };

  return (
    <div className="space-y-5">
      {/* Información de la app */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-3xl">
              🍹
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Drinks Manager</h2>
              <p className="text-base text-slate-400">Versión {packageJson.version}</p>
            </div>
          </div>
          
          <p className="text-base text-slate-400 leading-relaxed">
            Aplicación para administrar tu puesto de bebidas y tragos. 
            Registra ventas, controla insumos y ve tus ganancias en tiempo real.
          </p>
        </CardContent>
      </Card>

      {/* PWA Info */}
      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <Info size={24} className="text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-lg text-white mb-2">Instalar en tu dispositivo</h3>
              <p className="text-base text-slate-400">
                Esta es una PWA (Progressive Web App). Para instalarla en iOS:
              </p>
              <ol className="text-base text-slate-400 mt-3 space-y-2 list-decimal list-inside">
                <li>Abre esta página en Safari</li>
                <li>Toca el botón de compartir</li>
                <li>Selecciona "Agregar a pantalla de inicio"</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Almacenamiento */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-lg text-white mb-3">Almacenamiento</h3>
          <p className="text-base text-slate-400 mb-5 leading-relaxed">
            Todos los datos se guardan localmente en tu dispositivo. 
            No se envía información a ningún servidor.
          </p>
          
          <Button
            variant="danger"
            className="w-full justify-center"
            onClick={() => setShowConfirmModal(true)}
          >
            <Trash2 size={20} className="mr-2" />
            Borrar todos los datos
          </Button>
        </CardContent>
      </Card>

      {/* Créditos */}
      <Card>
        <CardContent>
          <p className="text-base text-slate-500 text-center">
            Desarrollado con ❤️ para tu negocio
          </p>
          <p className="text-sm text-slate-600 text-center mt-2">
            React + TypeScript + Tailwind CSS
          </p>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar eliminación"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4 p-5 bg-red-900/20 border border-red-800 rounded-xl">
            <AlertTriangle size={28} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-lg text-red-400">¡Atención!</p>
              <p className="text-base text-slate-300 mt-2">
                Esta acción eliminará permanentemente todos los datos:
              </p>
              <ul className="text-base text-slate-400 mt-3 space-y-1 list-disc list-inside">
                <li>Todas las ventas registradas</li>
                <li>Todos los insumos ingresados</li>
                <li>Los tragos personalizados</li>
              </ul>
              <p className="text-base text-slate-300 mt-3">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleClearData}
            >
              Sí, borrar todo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
