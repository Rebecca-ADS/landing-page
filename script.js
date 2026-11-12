const form = document.getElementById("form");
const resposta = document.getElementById("resposta");
const cepInput = document.getElementById("cep");
const cepStatus = document.getElementById("cep-status");

const camposEndereco = {
  rua: document.getElementById("rua"),
  bairro: document.getElementById("bairro"),
  cidade: document.getElementById("cidade"),
  uf: document.getElementById("uf"),
};

/* ---------- ViaCEP ---------- */
function limparEndereco() {
  Object.values(camposEndereco).forEach((campo) => (campo.value = ""));
}

function mostrarStatusCep(texto, erro = false) {
  cepStatus.textContent = texto;
  cepStatus.classList.toggle("erro", erro);
}

async function buscarCep() {
  const cep = cepInput.value.replace(/\D/g, "");

  if (cep.length === 0) {
    mostrarStatusCep("");
    limparEndereco();
    return;
  }
  if (cep.length !== 8) {
    mostrarStatusCep("O CEP deve ter 8 números.", true);
    limparEndereco();
    return;
  }

  mostrarStatusCep("Buscando endereço...");

  try {
    const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resp.json();

    if (dados.erro) {
      mostrarStatusCep("CEP não encontrado. Confira os números.", true);
      limparEndereco();
      return;
    }

    camposEndereco.rua.value = dados.logradouro;
    camposEndereco.bairro.value = dados.bairro;
    camposEndereco.cidade.value = dados.localidade;
    camposEndereco.uf.value = dados.uf;
    mostrarStatusCep("Endereço encontrado.");
  } catch (e) {
    mostrarStatusCep("Não foi possível consultar o CEP. Tente de novo.", true);
  }
}

// Formata como 00000-000 enquanto digita e busca ao completar
cepInput.addEventListener("input", () => {
  let v = cepInput.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
  cepInput.value = v;
  if (v.replace("-", "").length === 8) buscarCep();
});
cepInput.addEventListener("blur", buscarCep);

/* ---------- Formulário ---------- */
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = form.nome;
  const email = form.email;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

  nome.classList.toggle("invalido", nome.value.trim() === "");
  email.classList.toggle("invalido", !emailValido);

  if (nome.value.trim() === "" || !emailValido) {
    resposta.textContent = "Preencha seu nome e um e-mail válido.";
    resposta.classList.add("erro");
    return;
  }

  resposta.classList.remove("erro");
  resposta.textContent = `Obrigado, ${nome.value.trim()}! Sua inscrição foi recebida.`;
  form.reset();
  limparEndereco();
  mostrarStatusCep("");
});

/* ---------- Botão de chamada para ação ---------- */
document.getElementById("btn-cta").addEventListener("click", () => {
  // Leva o foco ao primeiro campo depois da rolagem
  setTimeout(() => document.getElementById("nome").focus(), 400);
});