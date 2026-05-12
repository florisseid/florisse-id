import { MapPin, Mail, Send } from 'lucide-react';
import { colors, getWaLink } from '../data';

const ContactSection = () => (
  <section id="contact" className="py-20 md:py-32 relative bg-slate-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-[300px] lg:h-auto min-h-[400px] lg:min-h-[500px]">
            <iframe title="Florisse Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.189495650505!2d114.5941624!3d-3.3032350999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2de4233d40f7fb4d%3A0xade319e2680dcaf7!2sFLORISSE!5e0!3m2!1sen!2sid!4v1778256637372!5m2!1sen!2sid" className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700" allowFullScreen="" loading="lazy"></iframe>
          </div>
          <div className="p-8 md:p-12 lg:p-16">
            <div className="mb-10">
              <span className="font-bold tracking-widest text-xs uppercase" style={{ color: colors.peach }}>Hubungi Kami</span>
              <h2 className="text-4xl font-serif font-bold mt-2 text-slate-900">Mari Berhubung</h2>
            </div>
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 mt-1" style={{ backgroundColor: colors.peach }}><MapPin size={18} /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Lokasi</p><p className="text-sm font-medium leading-relaxed">Antasan Kecil Timur, Banjarmasin Utara, Banjarmasin City, South Kalimantan 70123</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 mt-1" style={{ backgroundColor: '#b7d7f7' }}><Mail size={18} /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="text-sm font-medium">florisse.id@gmail.com</p></div>
              </div>
            </div>
            <div className="space-y-4">
              <textarea placeholder="Tuliskan pesan atau pertanyaan Anda di sini..." rows="3" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:border-[#f8b1d2] focus:bg-white outline-none transition"></textarea>
              <button onClick={() => window.open(getWaLink('Halo Florisse! Saya ingin bertanya tentang produk Anda.'), '_blank')} className="w-full py-4 rounded-2xl text-white font-bold shadow-md transition transform hover:-translate-y-1 flex items-center justify-center gap-2" style={{ backgroundColor: colors.peach }}>Kirim via WhatsApp <Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
