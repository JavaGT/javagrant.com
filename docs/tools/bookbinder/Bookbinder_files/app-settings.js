document.addEventListener('DOMContentLoaded', () => {
  // -- Profiles Logic --
  const form = document.getElementById('bookbinder');
  const profileSelect = document.getElementById('profile_select');
  const profileNameInput = document.getElementById('profile_name_input');
  const saveBtn = document.getElementById('save_profile_btn');
  const loadBtn = document.getElementById('load_profile_btn');
  const deleteBtn = document.getElementById('delete_profile_btn');
  const exportBtn = document.getElementById('export_profiles_btn');
  const importBtn = document.getElementById('import_profiles_btn');
  const importInput = document.getElementById('import_profiles_input');
  const LOCAL_STORAGE_KEY = 'bookbinder_profiles';

  function getProfiles() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProfiles(profiles) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  }

  function updateProfileDropdown() {
    const profiles = getProfiles();
    const currentVal = profileSelect.value;
    profileSelect.innerHTML = '<option value="">-- Select a Profile --</option>';
    for (const name of Object.keys(profiles).sort()) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      profileSelect.appendChild(opt);
    }
    if (profiles[currentVal]) {
      profileSelect.value = currentVal;
    }
  }

  if(saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = profileNameInput.value.trim();
      if (!name) {
        alert("Please enter a profile name.");
        return;
      }
  
      const allInputs = form.querySelectorAll('input, select, textarea');
      const state = {};
      allInputs.forEach(el => {
        if (el.type === 'file') return;
        if (el.id && el.id.startsWith('profile_')) return;
  
        if (el.name || el.id) {
          const key = el.id || el.name;
          if (el.type === 'checkbox' || el.type === 'radio') {
            state[key] = el.checked;
          } else {
            state[key] = el.value;
          }
        }
      });
  
      const profiles = getProfiles();
      profiles[name] = state;
      saveProfiles(profiles);
      updateProfileDropdown();
      profileSelect.value = name;
    });
  }

  if(loadBtn) {
    loadBtn.addEventListener('click', () => {
      const name = profileSelect.value;
      if (!name) {
        alert("Please select a profile to load.");
        return;
      }
      const profiles = getProfiles();
      const state = profiles[name];
      if (!state) return;
  
      const allInputs = form.querySelectorAll('input, select, textarea');
      allInputs.forEach(el => {
        if (el.type === 'file') return;
        if (el.id && el.id.startsWith('profile_')) return;
  
        const key = el.id || el.name;
        if (state[key] !== undefined) {
          let changed = false;
          if (el.type === 'checkbox' || el.type === 'radio') {
            if (el.checked !== state[key]) {
              el.checked = state[key];
              changed = true;
            }
          } else {
            if (el.value !== state[key]) {
              el.value = state[key];
              changed = true;
            }
          }
          if (changed) {
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      });
      profileNameInput.value = name;
    });
  }

  if(deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const name = profileSelect.value;
      if (!name) {
        alert("Please select a profile to delete.");
        return;
      }
      if (confirm(`Are you sure you want to delete the profile "${name}"?`)) {
        const profiles = getProfiles();
        delete profiles[name];
        saveProfiles(profiles);
        updateProfileDropdown();
        profileNameInput.value = '';
      }
    });
  }

  if(exportBtn) {
    exportBtn.addEventListener('click', () => {
      const profiles = getProfiles();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "bookbinder_profiles.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  }

  if(importBtn && importInput) {
    importBtn.addEventListener('click', () => {
      importInput.click();
    });
  
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedProfiles = JSON.parse(event.target.result);
          if (typeof importedProfiles !== 'object' || importedProfiles === null) {
            throw new Error("Invalid format");
          }
          const profiles = getProfiles();
          const merged = { ...profiles, ...importedProfiles };
          saveProfiles(merged);
          updateProfileDropdown();
          alert("Profiles imported successfully!");
        } catch (err) {
          alert("Failed to parse JSON file.");
        }
        importInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  if(profileSelect) {
    updateProfileDropdown();
  }

  // -- Theme & Settings Logic --
  const themeStylesheet = document.getElementById('theme_stylesheet');
  const settingsModal = document.getElementById('settings_modal');
  const openSettingsBtn = document.getElementById('open_settings_btn');
  const closeSettingsBtn = document.getElementById('close_settings_btn');
  const themeBtns = document.querySelectorAll('.theme-btn');

  const THEME_STORAGE_KEY = 'bookbinder_theme';

  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || '';
    setTheme(savedTheme);
  }

  function setTheme(themeUrl) {
    if(themeStylesheet) {
      themeStylesheet.setAttribute('href', themeUrl);
    }
    localStorage.setItem(THEME_STORAGE_KEY, themeUrl);
  }

  if(openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      settingsModal.showModal();
    });
  }

  if(closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.close();
    });
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const themeUrl = e.target.getAttribute('data-theme');
      setTheme(themeUrl);
    });
  });

  // Initialize theme on load
  loadTheme();
});
