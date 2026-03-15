const { contextBridge, ipcRenderer } = require("electron");

// ওয়েবপেজ থেকে Electron API ব্যবহার করার bridge
contextBridge.exposeInMainWorld("electronAPI", {
  // উইন্ডো কন্ট্রোল
  minimize:   () => ipcRenderer.send("minimize-window"),
  maximize:   () => ipcRenderer.send("maximize-window"),
  close:      () => ipcRenderer.send("close-window"),
  reload:     () => ipcRenderer.send("reload-window"),

  // অ্যাপ তথ্য
  getVersion:  () => ipcRenderer.invoke("get-app-version"),
  getPlatform: () => ipcRenderer.invoke("get-platform"),

  // CSS কন্ট্রোল
  reloadCSS:  () => ipcRenderer.send("reload-css"),

  // ডেস্কটপ অ্যাপ কিনা চেক করতে
  isDesktop: true,
});
