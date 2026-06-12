use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(default)]
pub struct Settings {
    pub device_type: String,
    pub input_device: String,
    pub output_device: String,
    pub sample_rate: f64,
    pub buffer_size: usize,
    pub input_channel: usize,
    pub strings: usize,
    pub pickups: usize,
    pub a4_hz: f32,
    pub monitor_gain_db: f32,
    pub monitor_mute: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            device_type: "ASIO".into(),
            input_device: String::new(),
            output_device: String::new(),
            sample_rate: 48_000.0,
            buffer_size: 256,
            input_channel: 0,
            strings: 6,
            pickups: 2,
            a4_hz: 440.0,
            monitor_gain_db: 0.0,
            monitor_mute: false,
        }
    }
}

impl Settings {
    pub fn default_path() -> Option<PathBuf> {
        directories::ProjectDirs::from("", "", "pickup-tuner")
            .map(|d| d.config_dir().join("config.json"))
    }

    /// Tolerant load: missing or corrupt files yield defaults rather than
    /// errors, so a bad config can never prevent startup.
    pub fn load(path: &Path) -> Self {
        std::fs::read_to_string(path)
            .ok()
            .and_then(|text| serde_json::from_str(&text).ok())
            .unwrap_or_default()
    }

    pub fn save(&self, path: &Path) -> Result<()> {
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        std::fs::write(path, serde_json::to_string_pretty(self)?)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn defaults_are_sensible() {
        let s = Settings::default();
        assert_eq!(s.sample_rate, 48_000.0);
        assert_eq!(s.buffer_size, 256);
        assert_eq!(s.strings, 6);
        assert_eq!(s.pickups, 2);
        assert_eq!(s.a4_hz, 440.0);
        assert_eq!(s.device_type, "ASIO");
        assert!(!s.monitor_mute);
    }

    #[test]
    fn save_and_load_round_trip() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("config.json");
        let s = Settings {
            input_device: "Focusrite USB ASIO".into(),
            buffer_size: 128,
            ..Settings::default()
        };
        s.save(&path).unwrap();
        let loaded = Settings::load(&path);
        assert_eq!(loaded, s);
    }

    #[test]
    fn save_creates_missing_parent_dirs() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("nested").join("dirs").join("config.json");
        Settings::default().save(&path).unwrap();
        assert!(path.exists());
    }

    #[test]
    fn load_missing_file_returns_default() {
        let dir = tempfile::tempdir().unwrap();
        assert_eq!(
            Settings::load(&dir.path().join("nope.json")),
            Settings::default()
        );
    }

    #[test]
    fn load_corrupt_file_returns_default() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("config.json");
        std::fs::write(&path, "{not json").unwrap();
        assert_eq!(Settings::load(&path), Settings::default());
    }

    #[test]
    fn unknown_fields_in_file_are_tolerated() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("config.json");
        std::fs::write(&path, r#"{"buffer_size": 64, "future_field": true}"#).unwrap();
        let loaded = Settings::load(&path);
        assert_eq!(loaded.buffer_size, 64);
        assert_eq!(loaded.strings, 6);
    }
}
