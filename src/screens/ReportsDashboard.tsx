import { useEffect, useState, FC } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { TrendingUp, TrendingDown, Package, AlertTriangle, BarChart3, FileSpreadsheet, Printer } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/Skeleton';

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;

interface Vendido { nombre: string; unidades: number; ingreso: number; }
interface Cat { nombre: string; monto: number; }
interface Rep { ingresos: number; masVendidos: Vendido[]; menosVendidos: Vendido[]; porCat: Cat[]; agotados: number; }

const ReportsDashboard: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { success } = useToast();
  const [d, setD] = useState<Rep | null>(null);

  useEffect(() => { if (!authLoading && user) api.get<Rep>('/admin/reportes').then(setD).catch(() => {}); }, [authLoading, user]);
  if (!authLoading && (!user || !user.paginas?.includes('reportes'))) return <Navigate to="/admin" replace />;

  const maxCat = Math.max(1, ...(d?.porCat.map(c => Number(c.monto)) ?? [1]));
  const costoInv = d ? Number(d.ingresos) * 0.4 : 0;
  const hoyStr = new Date().toLocaleString('es-PE');

  const exportarExcel = () => {
    if (!d) return;
    const esc = (v: any) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const money = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;
    const th = (t: string, extra = '') => `<th style="${extra}">${esc(t)}</th>`;
    const td = (t: any, extra = '') => `<td style="${extra}">${esc(t)}</td>`;
    const tdNum = (n: number | string) => `<td class="num">${money(n)}</td>`;

    const filasCat = d.porCat.map(c => `<tr>${td(c.nombre)}${tdNum(c.monto)}</tr>`).join('');
    const filasMas = d.masVendidos.map((v, i) => `<tr>${td(i + 1, 'text-align:center')}${td(v.nombre)}<td class="num">${v.unidades}</td>${tdNum(v.ingreso)}</tr>`).join('');
    const filasMenos = d.menosVendidos.map((v, i) => `<tr>${td(i + 1, 'text-align:center')}${td(v.nombre)}<td class="num">${v.unidades}</td>${tdNum(v.ingreso)}</tr>`).join('');

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8">
<style>
  body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#0f172a}
  .title{font-size:20pt;font-weight:bold;color:#16a34a}
  .sub{font-size:9pt;color:#64748b}
  table{border-collapse:collapse;margin:6px 0 18px 0}
  th{background:#16a34a;color:#ffffff;font-weight:bold;border:1px solid #0f7a37;padding:7px 12px;text-align:left}
  td{border:1px solid #d7dee7;padding:6px 12px}
  .num{text-align:right;mso-number-format:"0.00"}
  .sec{font-size:13pt;font-weight:bold;color:#0f172a;padding-top:6px}
  .kpi td:first-child{background:#f1f5f9;font-weight:bold}
  .kpi td:last-child{text-align:right;color:#16a34a;font-weight:bold}
</style></head>
<body>
  <div class="title">Sumaq — Reporte de ventas</div>
  <div class="sub">Generado: ${esc(hoyStr)}</div>

  <div class="sec">Resumen</div>
  <table class="kpi">
    <tr><td style="width:260px">Ingresos totales</td><td style="width:160px">${money(d.ingresos)}</td></tr>
    <tr><td>Costo de inventario (est. 40%)</td><td>${money(costoInv)}</td></tr>
    <tr><td>Platillos agotados / sin stock</td><td>${d.agotados}</td></tr>
  </table>

  <div class="sec">Rentabilidad por categoría</div>
  <table><tr>${th('Categoría', 'width:260px')}${th('Ingresos', 'width:160px;text-align:right')}</tr>${filasCat}</table>

  <div class="sec">Más vendidos</div>
  <table><tr>${th('#', 'width:44px;text-align:center')}${th('Platillo', 'width:300px')}${th('Uds.', 'width:80px;text-align:right')}${th('Ingresos', 'width:140px;text-align:right')}</tr>${filasMas}</table>

  <div class="sec">Menos vendidos</div>
  <table><tr>${th('#', 'width:44px;text-align:center')}${th('Platillo', 'width:300px')}${th('Uds.', 'width:80px;text-align:right')}${th('Ingresos', 'width:140px;text-align:right')}</tr>${filasMenos}</table>
</body></html>`;

    const blob = new Blob(['﻿' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `reporte-qarmi-${new Date().toISOString().slice(0, 10)}.xls`;
    a.click(); URL.revokeObjectURL(url);
    success('Reporte exportado a Excel');
  };

  const Tabla: FC<{ title: string; icon: any; color: string; rows: Vendido[] }> = ({ title, icon: Icon, color, rows }) => (
    <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden qz-up pdf-avoid-break">
      <div className="p-6 border-b border-outline-variant/30 flex items-center gap-3"><span className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={20} /></span><h3 className="font-display text-2xl text-on-surface">{title}</h3></div>
      <table className="w-full text-sm text-left">
        <thead><tr className="bg-surface-container-low/30 border-b border-outline-variant/30"><th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase">Platillo</th><th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase text-center">Uds.</th><th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase text-right">Ingresos</th></tr></thead>
        <tbody className="divide-y divide-outline-variant/20">
          {rows.map((v, i) => <tr key={i} className="hover:bg-surface-container-low/20"><td className="py-3 px-6 font-semibold text-on-surface">{v.nombre}</td><td className="py-3 px-6 text-center">{v.unidades}</td><td className="py-3 px-6 text-right font-bold text-on-surface-variant">{soles(v.ingreso)}</td></tr>)}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-8 pb-6 border-b border-outline-variant/30 flex flex-wrap items-center gap-4 qz-up">
          <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><BarChart3 size={28} /></span>
          <div className="mr-auto"><h1 className="font-display text-4xl text-primary">Reportes e Inventario</h1><p className="text-on-surface-variant mt-1.5">Análisis de ventas y rentabilidad.</p></div>
          <div className="flex items-center gap-3 no-print">
            <button onClick={exportarExcel} disabled={!d} className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-full shadow-md hover:brightness-110 transition disabled:opacity-50"><FileSpreadsheet size={18} /> Excel</button>
            <button onClick={() => window.print()} disabled={!d} className="inline-flex items-center gap-2 border border-outline-variant text-on-surface-variant font-semibold px-5 py-2.5 rounded-full hover:bg-surface-variant transition disabled:opacity-50"><Printer size={18} /> PDF</button>
          </div>
        </header>
        {!d ? (
          <>
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5">
                    <Skeleton className="h-3 w-32 mb-4" /><Skeleton className="h-10 w-40" />
                  </div>
                ))}
              </div>
              <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5">
                <Skeleton className="h-7 w-64 mb-8" />
                <div className="flex items-end justify-around gap-4 h-72">
                  {[55, 80, 40, 70, 50].map((h, i) => <div key={i} className="flex-1 max-w-[52px] flex items-end" style={{ height: `${h}%` }}><Skeleton className="w-full h-full rounded-t-md rounded-b-none" /></div>)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-6 shadow-xl shadow-primary/5">
                  <Skeleton className="h-8 w-48 mb-6" />
                  {Array.from({ length: 5 }).map((_, j) => <div key={j} className="flex items-center gap-4 py-3"><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-10" /><Skeleton className="h-4 w-16" /></div>)}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div id="reporte-print">
            <div className="hidden print:block mb-6 border-b border-outline-variant/40 pb-4">
              <h2 className="font-display text-2xl text-primary">Sumaq — Reporte de ventas</h2>
              <p className="text-xs text-on-surface-variant">Generado: {hoyStr}</p>
            </div>
            <div className="grid grid-cols-12 gap-6 mb-6 print-stack">
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 qz-up qz-up-1 qz-hover">
                  <div className="flex justify-between items-start mb-2"><h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Ingresos Totales</h3><TrendingUp size={20} className="text-tertiary" /></div>
                  <p className="font-display text-4xl text-primary">{soles(d.ingresos)}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 qz-up qz-up-2 qz-hover">
                  <div className="flex justify-between items-start mb-2"><h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Costo de Inventario</h3><Package size={20} className="text-error" /></div>
                  <p className="font-display text-4xl text-on-surface">{soles(costoInv)}</p><span className="text-xs text-on-surface-variant">Estimado ~40%</span>
                </div>
                <div className="rounded-[2rem] p-8 border border-primary/20 bg-primary/5 flex flex-col justify-end min-h-40 qz-up qz-up-3 qz-hover">
                  <AlertTriangle className="text-primary mb-3" size={28} /><h4 className="font-display text-2xl text-primary mb-1">Alerta de Stock</h4>
                  <p className="text-sm text-on-surface-variant">{d.agotados} platillos agotados o sin stock.</p>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 flex flex-col qz-up qz-up-4 pdf-avoid-break">
                <h3 className="font-display text-2xl text-on-surface mb-8">Rentabilidad por Categoría</h3>
                <div className="flex-1 flex items-end justify-around gap-4 h-72 border-t border-dashed border-outline-variant/40 pt-4">
                  {d.porCat.map((c, i) => (
                    <div key={i} className="flex-1 h-full flex flex-col items-center justify-end group">
                      <span className="text-[11px] font-bold text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{soles(c.monto)}</span>
                      <div className="w-full max-w-[52px] rounded-t-md bg-primary transition-all" style={{ height: `${Math.max(6, Math.round(Number(c.monto) / maxCat * 220))}px` }} />
                      <span className="mt-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center truncate w-full">{c.nombre}</span>
                    </div>
                  ))}
                  {d.porCat.length === 0 && <p className="text-on-surface-variant text-sm m-auto">Sin ventas registradas.</p>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 print-stack">
              <Tabla title="Más Vendidos" icon={TrendingUp} color="bg-primary/10 text-primary" rows={d.masVendidos} />
              <Tabla title="Menos Vendidos" icon={TrendingDown} color="bg-error/10 text-error" rows={d.menosVendidos} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsDashboard;
