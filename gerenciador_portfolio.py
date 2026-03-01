import json
import tkinter as tk
from tkinter import ttk, messagebox
import os
import shutil

# Chaves conhecidas que armazenam listas de dicionários (Objetos complexos)
LISTS_OF_DICTS = {"socials", "cta", "stats", "links", "education", "experiences", "certificates", "skills", "projects"}

# Modelos vazios para quando o usuário clicar em "Adicionar Novo" em uma lista vazia
TEMPLATES = {
    "socials": {"label": "", "icon": "", "url": ""},
    "cta": {"label": "", "url": "", "type": ""},
    "stats": {"value": "", "label": ""},
    "links": {"label": "", "url": ""},
    "education": {"institution": "", "degree": "", "period": "", "type": "", "issuer": "", "description": ""},
    "experiences": {"title": "", "company": "", "companyUrl": "", "type": "", "period": "", "location": "", "description": "", "achievements": [], "technologies": []},
    "certificates": {"title": "", "url": ""},
    "skills": {"name": "", "icon": "", "alt": "", "category": ""},
    "projects": {"title": "", "description": "", "longDescription": "", "category": "", "year": "", "status": "", "thumbnail": "", "images": [], "technologies": [], "links": []}
}

class ScrollableFrame(ttk.Frame):
    """Componente customizado para criar áreas com barra de rolagem vertical (Scroll)."""
    def __init__(self, container, *args, **kwargs):
        super().__init__(container, *args, **kwargs)
        self.canvas = tk.Canvas(self, borderwidth=0, highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.inner_frame = ttk.Frame(self.canvas)

        self.inner_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )
        self.canvas_window = self.canvas.create_window((0, 0), window=self.inner_frame, anchor="nw")
        self.canvas.bind("<Configure>", self.on_canvas_configure)
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        
        self.canvas.pack(side="left", fill="both", expand=True)
        self.scrollbar.pack(side="right", fill="y")

        self.bind_mouse_wheel()

    def on_canvas_configure(self, event):
        self.canvas.itemconfig(self.canvas_window, width=event.width)

    def bind_mouse_wheel(self):
        def _on_mousewheel(event):
            self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        # Bind para Windows e Mac
        self.canvas.bind_all("<MouseWheel>", _on_mousewheel)
        # Bind para Linux
        self.canvas.bind_all("<Button-4>", lambda e: self.canvas.yview_scroll(-1, "units"))
        self.canvas.bind_all("<Button-5>", lambda e: self.canvas.yview_scroll(1, "units"))


class PortfolioCRUDApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Gerenciador de Portfólio JSON Dinâmico")
        self.root.geometry("1100x700")
        
        self.filepath = "portfolio-data.json"
        self.data = {}
        self.current_selections = {} # Memoriza qual item está selecionado nas listas
        
        self.load_data()
        self.build_main_ui()

    def load_data(self):
        if not os.path.exists(self.filepath):
            messagebox.showwarning("Aviso", f"Arquivo {self.filepath} não encontrado. Um novo será criado.")
            self.data = {}
            return

        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao ler o arquivo JSON:\n{e}")
            self.data = {}

    def save_data(self):
        try:
            if os.path.exists(self.filepath):
                shutil.copy(self.filepath, self.filepath + ".backup")

            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=4, ensure_ascii=False)
            
            messagebox.showinfo("Sucesso", "Dados salvos com sucesso e backup criado!")
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao salvar:\n{e}")

    def build_main_ui(self):
        top_frame = tk.Frame(self.root, bg="#2c3e50", pady=10, padx=10)
        top_frame.pack(fill=tk.X)
        
        lbl_title = tk.Label(top_frame, text="Painel de Edição", fg="white", bg="#2c3e50", font=("Arial", 14, "bold"))
        lbl_title.pack(side=tk.LEFT)

        btn_save = tk.Button(top_frame, text="💾 Salvar no JSON", bg="#27ae60", fg="white", font=("Arial", 10, "bold"), command=self.save_data)
        btn_save.pack(side=tk.RIGHT)

        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Para cada chave raiz do JSON, cria uma aba
        for section_key, section_data in self.data.items():
            tab = ttk.Frame(self.notebook)
            self.notebook.add(tab, text=section_key.replace('_', ' ').title())
            
            if isinstance(section_data, dict):
                self.build_dict_tab(tab, section_key, section_data)
            elif isinstance(section_data, list):
                self.build_list_tab(tab, section_key, section_data)

    # =========================================================================
    # RENDERIZAÇÃO DE ABAS SIMPLES (Ex: Profile, About)
    # =========================================================================
    def build_dict_tab(self, parent, section_key, section_data):
        scroll_frame = ScrollableFrame(parent)
        scroll_frame.pack(fill=tk.BOTH, expand=True)
        
        def refresh_ui():
            for w in scroll_frame.inner_frame.winfo_children(): w.destroy()
            self.render_form(scroll_frame.inner_frame, section_data, refresh_ui)

        refresh_ui()

    # =========================================================================
    # RENDERIZAÇÃO DE ABAS COM LISTA (Ex: Projects, Experiences)
    # =========================================================================
    def build_list_tab(self, parent, section_key, section_list):
        paned = tk.PanedWindow(parent, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True)

        left_frame = tk.Frame(paned, width=250)
        paned.add(left_frame)

        listbox = tk.Listbox(left_frame, font=("Arial", 10), exportselection=False)
        listbox.pack(fill=tk.BOTH, expand=True, pady=5)

        right_frame = ScrollableFrame(paned)
        paned.add(right_frame)

        def refresh_listbox():
            listbox.delete(0, tk.END)
            for index, item in enumerate(self.data[section_key]):
                display_name = item.get('title', item.get('name', item.get('institution', f"Item {index + 1}")))
                listbox.insert(tk.END, display_name)

        def refresh_right_frame():
            for w in right_frame.inner_frame.winfo_children(): w.destroy()
            idx = self.current_selections.get(section_key, None)
            if idx is not None and idx < len(self.data[section_key]):
                self.render_form(right_frame.inner_frame, self.data[section_key][idx], refresh_right_frame)
                
        def on_select(event):
            selection = listbox.curselection()
            if selection:
                self.current_selections[section_key] = selection[0]
                refresh_right_frame()

        listbox.bind("<<ListboxSelect>>", on_select)
        refresh_listbox()

        btn_frame = tk.Frame(left_frame)
        btn_frame.pack(fill=tk.X)
        
        tk.Button(btn_frame, text="➕ Novo", bg="#3498db", fg="white", 
                  command=lambda: self.add_top_list_item(section_key, refresh_listbox)).pack(side=tk.LEFT, fill=tk.X, expand=True)
        tk.Button(btn_frame, text="🗑️ Excluir", bg="#e74c3c", fg="white", 
                  command=lambda: self.delete_top_list_item(section_key, listbox, refresh_listbox, right_frame.inner_frame)).pack(side=tk.RIGHT, fill=tk.X, expand=True)

    def add_top_list_item(self, section_key, refresh_callback):
        template = TEMPLATES.get(section_key, {"title": "Novo Item"}).copy()
        self.data[section_key].append(template)
        refresh_callback()

    def delete_top_list_item(self, section_key, listbox, refresh_callback, right_inner_frame):
        selection = listbox.curselection()
        if not selection: return
        if messagebox.askyesno("Confirmar", "Tem certeza que deseja excluir este item principal?"):
            del self.data[section_key][selection[0]]
            self.current_selections[section_key] = None
            refresh_callback()
            for w in right_inner_frame.winfo_children(): w.destroy()

    # =========================================================================
    # MOTOR DE RENDERIZAÇÃO DE FORMULÁRIO DINÂMICO
    # =========================================================================
    def render_form(self, container, data_dict, refresh_callback):
        """Varre o dicionário e cria o input correto para o tipo de dado."""
        for key, value in data_dict.items():
            row = tk.Frame(container, pady=8)
            row.pack(fill=tk.X, padx=10)
            
            lbl = tk.Label(row, text=key.title()+":", width=18, anchor='ne', font=("Arial", 10, "bold"))
            lbl.pack(side=tk.LEFT, fill=tk.Y)
            
            if isinstance(value, list):
                if key in LISTS_OF_DICTS:
                    # Renderiza sub-formulário de Dicionários (ex: links, socials)
                    self.render_nested_dicts(row, key, value, refresh_callback)
                else:
                    # Renderiza lista de Strings (ex: achievements, technologies)
                    tk.Label(row, text="(Um item por linha)", font=("Arial", 8), fg="gray").pack(side=tk.LEFT)
                    txt = tk.Text(row, height=5, width=50)
                    txt.insert(tk.END, "\n".join(value))
                    txt.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
                    
                    def update_string_list(event, k=key, w=txt, d=data_dict):
                        lines = w.get("1.0", tk.END).split('\n')
                        d[k] = [line.strip() for line in lines if line.strip() != ""]
                    txt.bind("<KeyRelease>", update_string_list)
                    
            elif isinstance(value, bool):
                var = tk.BooleanVar(value=value)
                chk = tk.Checkbutton(row, variable=var)
                chk.pack(side=tk.LEFT, padx=5)
                def update_bool(*args, k=key, v=var, d=data_dict):
                    d[k] = v.get()
                var.trace_add("write", update_bool)
                
            else:
                # String ou Inteiro
                val_str = str(value)
                if len(val_str) > 60 or key in ["description", "longDescription", "paragraphs"]:
                    txt = tk.Text(row, height=4, width=50)
                    txt.insert(tk.END, val_str)
                    txt.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
                    
                    def update_txt(event, k=key, w=txt, d=data_dict, orig=value):
                        new_val = w.get("1.0", tk.END).strip()
                        if isinstance(orig, int):
                            try: new_val = int(new_val)
                            except: pass
                        d[k] = new_val
                    txt.bind("<KeyRelease>", update_txt)
                else:
                    var = tk.StringVar(value=val_str)
                    ent = tk.Entry(row, textvariable=var, width=50)
                    ent.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
                    
                    def update_ent(*args, k=key, v=var, d=data_dict, orig=value):
                        new_val = v.get()
                        if isinstance(orig, int):
                            try: new_val = int(new_val)
                            except: pass
                        d[k] = new_val
                    var.trace_add("write", update_ent)

    def render_nested_dicts(self, parent, key, list_data, refresh_callback):
        """Cria um quadro para editar Listas Aninhadas (ex: Links, Redes Sociais)."""
        container = tk.LabelFrame(parent, text=f" Editar {key.title()} ", bg="#f1f2f6", padx=5, pady=5)
        container.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        
        for i, item_dict in enumerate(list_data):
            # Caixa individual para cada item (ex: um Link específico)
            item_frame = tk.Frame(container, bg="#ffffff", highlightbackground="#bdc3c7", highlightthickness=1, pady=5)
            item_frame.pack(fill=tk.X, pady=3)
            
            inputs_frame = tk.Frame(item_frame, bg="#ffffff")
            inputs_frame.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
            
            # Renderiza os campinhos internos
            for k, v in item_dict.items():
                row = tk.Frame(inputs_frame, bg="#ffffff")
                row.pack(fill=tk.X, pady=2)
                
                tk.Label(row, text=k.title()+":", bg="#ffffff", width=10, anchor="w").pack(side=tk.LEFT)
                var = tk.StringVar(value=str(v))
                ent = tk.Entry(row, textvariable=var)
                ent.pack(side=tk.LEFT, fill=tk.X, expand=True)
                
                # Atualiza valor interno
                def update_val(*args, item_ref=item_dict, key_ref=k, var_ref=var):
                    item_ref[key_ref] = var_ref.get()
                var.trace_add("write", update_val)
            
            # Botão de remover o sub-item
            btn_del = tk.Button(item_frame, text="X", bg="#e74c3c", fg="white", font=("Arial", 8, "bold"),
                                command=lambda idx=i: self.delete_nested_item(list_data, idx, refresh_callback))
            btn_del.pack(side=tk.RIGHT, padx=10)
            
        # Botão para adicionar novo sub-item
        btn_add = tk.Button(container, text=f"➕ Adicionar {key}", bg="#2ecc71", fg="white",
                            command=lambda: self.add_nested_item(key, list_data, refresh_callback))
        btn_add.pack(pady=5)

    def delete_nested_item(self, list_data, idx, refresh_callback):
        if messagebox.askyesno("Confirmar", "Remover este item?"):
            del list_data[idx]
            refresh_callback() # Recarrega a tela para atualizar a lista aninhada

    def add_nested_item(self, key, list_data, refresh_callback):
        template = TEMPLATES.get(key, {"chave": ""}).copy()
        list_data.append(template)
        refresh_callback() # Recarrega a tela para mostrar o novo campo


if __name__ == "__main__":
    root = tk.Tk()
    app = PortfolioCRUDApp(root)
    root.mainloop()