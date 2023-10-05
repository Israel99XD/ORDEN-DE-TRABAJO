document.getElementById('generate-pdf').addEventListener('click', async () => {
  const response = await fetch('/generate-pdf');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'archivo.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});