import Swal from 'sweetalert2';

const swalDefaults = {
  background: '#1E2536',
  color: '#E2E8F0',
  confirmButtonColor: '#38BDF8',
  cancelButtonColor: '#64748B',
};

export function showSuccess(message) {
  return Swal.fire({
    ...swalDefaults,
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 1800,
    showConfirmButton: false,
  });
}

export function showError(message) {
  return Swal.fire({
    ...swalDefaults,
    icon: 'error',
    title: 'Gagal',
    text: message,
    confirmButtonText: 'Tutup',
  });
}

export function confirmDelete(itemName) {
  return Swal.fire({
    ...swalDefaults,
    icon: 'warning',
    title: 'Hapus data?',
    text: `${itemName} akan dihapus secara permanen.`,
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    reverseButtons: true,
  });
}
