import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Upload, Info, CheckCircle, X, FileText, Image, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const API = 'http://localhost:5000/api';
const CATEGORIES = ['Concert', 'Sports', 'Theater', 'Festival', 'Comedy', 'Other'];

const ISRAELI_CITIES = [
  'Acre', 'Afula', 'Arad', 'Ariel', 'Ashdod', 'Ashkelon', 'Bat Yam', 'Beersheba',
  'Beit Shemesh', 'Bnei Brak', 'Dimona', 'Eilat', 'Givatayim', 'Hadera', 'Haifa',
  'Harish', 'Herzliya', 'Hod HaSharon', 'Holon', 'Jerusalem', 'Kfar Saba', 'Kiryat Ata',
  'Kiryat Gat', 'Kiryat Motzkin', 'Lod', "Modi'in", 'Nahariya', 'Nazareth', 'Netanya',
  'Ness Ziona', 'Or Yehuda', 'Petah Tikva', "Ra'anana", 'Ramat Gan', 'Ramat HaSharon',
  'Ramla', 'Rehovot', 'Rishon LeZion', 'Rosh HaAyin', 'Shoham', 'Tel Aviv-Yafo',
  'Tiberias', 'Yavne',
];

const ISRAELI_VENUES = [
  'Barby Club', 'Beit Lessin Theater', 'Beersheba Theater', 'Bloomfield Stadium',
  'Caesarea Amphitheatre', 'Cameri Theater', 'Charles Bronfman Auditorium',
  'Ein Gev Amphitheatre', 'Expo Tel Aviv', 'Habima Theater', 'Haifa Auditorium',
  'Haifa Theater', 'HaMoshava Amphitheatre', 'Jerusalem Arena',
  'Jerusalem International Convention Centre', 'Jerusalem Theater',
  'Kiryat Eliezer Stadium', 'Live Park Rishon LeZion', 'Mann Auditorium',
  'Menora Mivtachim Arena', 'Netanya Stadium', 'Nokia Arena',
  'Ramat Gan Stadium', 'Sammy Ofer Stadium', 'Sultan\'s Pool',
  'Suzanne Dellal Centre', 'Teddy Stadium', 'Tel Aviv Convention Center',
  'Turner Stadium', 'Yarkon Park', 'Zappa Herzliya', 'Zappa Jerusalem',
  'Zappa Tel Aviv',
];

const inputClass = "w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";
const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2";

interface SelectedFile {
  file: File;
  preview: string | null;
}

interface SeatDetail {
  section: string;
  row: string;
  seat: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Combobox({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [inputVal, setInputVal] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => { setInputVal(value); }, [value]);

  const filtered = options
    .filter(o => !inputVal || o.toLowerCase().includes(inputVal.toLowerCase()))
    .slice(0, 15);

  const select = (opt: string) => {
    setInputVal(opt);
    onChange(opt);
    setOpen(false);
  };

  const handleBlur = () => {
    if (options.includes(inputVal)) {
      onChange(inputVal);
    } else {
      setInputVal('');
      onChange('');
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputVal}
        onChange={e => { setInputVal(e.target.value); onChange(''); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        className={inputClass}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-auto bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg text-sm">
          {filtered.map(opt => (
            <li
              key={opt}
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(opt)}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-900 dark:text-slate-100"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SellTicketPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const [form, setForm] = useState({
    event: '', category: '', date: '', venue: '', city: '',
    qty: '1', price: '', originalPrice: '', description: '',
    bundleOnly: false,
  });
  const [seatDetails, setSeatDetails] = useState<SeatDetail[]>([{ section: '', row: '', seat: '' }]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [commissionRate, setCommissionRate] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('tt_token');
    if (!token) return;
    fetch(`${API}/sellers/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (typeof data.commissionRate === 'number') setCommissionRate(data.commissionRate); })
      .catch(() => {});
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    if (k === 'qty') {
      const n = Number(val) || 1;
      setSeatDetails(prev => {
        const copy = [...prev];
        while (copy.length < n) copy.push({ section: '', row: '', seat: '' });
        return copy.slice(0, n);
      });
      setSelectedFiles(prev => {
        const trimmed = prev.slice(0, n);
        prev.slice(n).forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
        return trimmed;
      });
    }
  };

  const setSeat = (index: number, field: keyof SeatDetail, value: string) => {
    setSeatDetails(prev => prev.map((sd, i) => i === index ? { ...sd, [field]: value } : sd));
  };

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const limit = Number(form.qty) || 1;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const newEntries: SelectedFile[] = [];
    Array.from(incoming).forEach(file => {
      if (!allowed.includes(file.type)) return;
      if (file.size > 10 * 1024 * 1024) return;
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      newEntries.push({ file, preview });
    });
    setSelectedFiles(prev => {
      const combined = [...prev, ...newEntries];
      if (combined.length > limit) {
        setFileError(t('sell.fileLimitExceeded').replace('{n}', String(limit)));
        return combined.slice(0, limit);
      }
      setFileError('');
      return combined;
    });
  }, [form.qty, t]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview!);
      updated.splice(index, 1);
      return updated;
    });
    setFileError('');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.city || !ISRAELI_CITIES.includes(form.city)) {
      setError(t('sell.invalidCity'));
      return;
    }
    if (!form.venue || !ISRAELI_VENUES.includes(form.venue)) {
      setError(t('sell.invalidVenue'));
      return;
    }
    if (form.date < today) {
      setError(t('sell.pastDate'));
      return;
    }
    if (seatDetails.some(sd => !sd.section.trim() || !sd.row.trim() || !sd.seat.trim())) {
      setError(t('sell.missingSeatDetails'));
      return;
    }
    const seen = new Set<string>();
    for (const sd of seatDetails) {
      const key = `${sd.section.trim()}|${sd.row.trim()}|${sd.seat.trim()}`;
      if (seen.has(key)) {
        setError(t('sell.duplicateSeat'));
        return;
      }
      seen.add(key);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('tt_token');

      const formData = new FormData();
      formData.append('name', form.event);
      formData.append('category', form.category);
      formData.append('date', form.date);
      formData.append('venue', form.venue);
      formData.append('city', form.city);
      formData.append('qty', form.qty);
      formData.append('seatDetails', JSON.stringify(seatDetails));
      formData.append('price', form.price);
      if (form.originalPrice) formData.append('originalPrice', form.originalPrice);
      formData.append('description', form.description);
      formData.append('bundleOnly', String(form.bundleOnly));
      selectedFiles.forEach(({ file }) => formData.append('files', file));

      const res = await fetch(`${API}/tickets`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('sell.failed'));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t('sell.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('sell.successTitle')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            {t('sell.successDesc')}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors"
            >
              {t('sell.viewMarketplace')}
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedFiles([]);
                setSeatDetails([{ section: '', row: '', seat: '' }]);
                setForm({ event: '', category: '', date: '', venue: '', city: '', qty: '1', price: '', originalPrice: '', description: '', bundleOnly: false });
              }}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors hover:bg-slate-200 dark:hover:bg-zinc-800"
            >
              {t('sell.listAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('sell.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('sell.subtitle')}</p>
        </div>

        {/* Escrow notice */}
        <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-8">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1">{t('sell.protectionTitle')}</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
              {t('sell.protectionDesc')}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Event info */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-5">{t('sell.eventInfo')}</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('sell.eventName')}</label>
                <input type="text" value={form.event} onChange={set('event')} placeholder={t('sell.eventNamePlaceholder')} required className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('sell.category')}</label>
                  <select value={form.category} onChange={set('category')} required className={inputClass}>
                    <option value="">{t('sell.selectCategory')}</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('sell.eventDate')}</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={set('date')}
                    min={today}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('sell.venue')}</label>
                  <Combobox
                    value={form.venue}
                    onChange={v => setForm(f => ({ ...f, venue: v }))}
                    options={ISRAELI_VENUES}
                    placeholder={t('sell.venuePlaceholder')}
                  />
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{t('sell.venueHint')}</p>
                </div>
                <div>
                  <label className={labelClass}>{t('sell.city')}</label>
                  <Combobox
                    value={form.city}
                    onChange={v => setForm(f => ({ ...f, city: v }))}
                    options={ISRAELI_CITIES}
                    placeholder={t('sell.cityPlaceholder')}
                  />
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{t('sell.cityHint')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket details */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-5">{t('sell.ticketDetails')}</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('sell.qty')}</label>
                <select value={form.qty} onChange={set('qty')} className={inputClass}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t('sell.seatDetailsLabel')}</label>
                <div className="space-y-3">
                  {seatDetails.map((sd, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
                      {seatDetails.length > 1 && (
                        <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                          {t('sell.ticketLabel')} {i + 1}
                        </p>
                      )}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelClass}>{t('sell.section')}</label>
                          <input
                            type="text"
                            value={sd.section}
                            onChange={e => setSeat(i, 'section', e.target.value)}
                            placeholder={t('sell.sectionPlaceholder')}
                            required
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t('sell.row')}</label>
                          <input
                            type="text"
                            value={sd.row}
                            onChange={e => setSeat(i, 'row', e.target.value)}
                            placeholder={t('sell.rowPlaceholder')}
                            required
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t('sell.seat')}</label>
                          <input
                            type="text"
                            value={sd.seat}
                            onChange={e => setSeat(i, 'seat', e.target.value)}
                            placeholder={t('sell.seatPlaceholder')}
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('sell.askingPrice')}</label>
                  <input type="number" value={form.price} onChange={set('price')} placeholder="250" min="1" required className={inputClass} />
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Info className="w-3 h-3" /> {t('sell.serviceFee').replace('{rate}', String(commissionRate))}
                  </p>
                </div>
                <div>
                  <label className={labelClass}>{t('sell.faceValue')}</label>
                  <input type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="300" min="1" className={inputClass} />
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{t('sell.discountBadge')}</p>
                </div>
              </div>

              {Number(form.price) > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-xl px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>{t('sell.listedPrice')}</span>
                    <span>₪{Number(form.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>{t('sell.commissionFee').replace('{rate}', String(commissionRate))}</span>
                    <span className="text-red-500 dark:text-red-400">−₪{Math.round(Number(form.price) * commissionRate / 100).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-indigo-200 dark:border-indigo-700/50 pt-1.5 flex justify-between font-semibold text-slate-900 dark:text-white text-sm">
                    <span>{t('sell.youWillReceive')}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">₪{Math.round(Number(form.price) * (1 - commissionRate / 100)).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>{t('sell.description')}</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  placeholder={t('sell.descriptionPlaceholder')}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Bundle-only toggle — only relevant when selling more than 1 ticket */}
              {Number(form.qty) > 1 && (
                <div className="flex items-center justify-between py-3 px-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('sell.bundleOnly')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t('sell.bundleOnlyDesc')}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, bundleOnly: !f.bundleOnly }))}
                    className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${form.bundleOnly ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-700'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.bundleOnly ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* File upload */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{t('sell.ticketFiles')}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              {t('sell.filesDesc')}
            </p>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                dragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
              }`}
            >
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {t('sell.dropFiles')} <span className="text-indigo-600 dark:text-indigo-400 font-medium">{t('sell.clickUpload')}</span>
              </span>
              <span className="text-xs text-slate-400">{t('sell.fileTypes')} · {t('sell.fileLimit')} {form.qty}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                className="hidden"
                onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
              />
            </div>

            {fileError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3 shrink-0" /> {fileError}
              </p>
            )}

            {/* File list */}
            {selectedFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {selectedFiles.map(({ file, preview }, i) => (
                  <li key={`${file.name}-${i}`} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                    {preview ? (
                      <img src={preview} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center shrink-0">
                        {file.type === 'application/pdf'
                          ? <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          : <Image className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        }
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {loading ? t('sell.submitting') : t('sell.listForSale')}
          </button>
        </form>
      </div>
    </div>
  );
}
