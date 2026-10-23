import { useState } from 'react';

// BYOK 模型设置：仅保存在浏览器 localStorage，随对话请求发送，服务端不持久化。
export default function SettingsModal({ initial, onSave, onClose }) {
  const [baseUrl, setBaseUrl] = useState(initial?.base_url || '');
  const [model, setModel] = useState(initial?.model || '');
  const [apiKey, setApiKey] = useState(initial?.api_key || '');
  const [error, setError] = useState('');

  function save(e) {
    e.preventDefault();
    const cfg = {
      base_url: baseUrl.trim(),
      model: model.trim(),
      api_key: apiKey.trim(),
    };
    if (!cfg.api_key || !cfg.base_url || !cfg.model) {
      setError('请填写 Base URL、模型名称和你自己的 API Key。');
      return;
    }
    setError('');
    onSave(cfg);
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
        <h2>模型设置（BYOK）</h2>
        <p className="modal-tip">
          请填写你自己的 OpenAI 兼容 API。配置仅保存在本浏览器，并随每次对话请求发送；服务器不保存你的 API Key。
          本网站不提供默认模型密钥。
        </p>
        <label>
          Base URL
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.deepseek.com/v1"
          />
        </label>
        <label>
          模型名
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="deepseek-chat" />
        </label>
        <label>
          API Key
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-…"
            autoComplete="off"
          />
        </label>
        {error && <div className="login-error">{error}</div>}
        <div className="modal-actions">
          <span className="flex" />
          <button type="button" onClick={onClose}>
            取消
          </button>
          <button className="primary" type="submit">
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
