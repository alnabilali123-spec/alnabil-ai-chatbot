import gradio as gr
from llama_cpp import Llama

# بيانات الموديل من Hugging Face
REPO_ID = "Alnabilali1/syper_alnabilali_2025"
MODEL_FILE = "unsloth.F16.gguf"

# تحميل الموديل عند التشغيل
llm = Llama.from_pretrained(
    repo_id=REPO_ID,
    filename=MODEL_FILE,
    n_gpu_layers=0
)

# دالة الرد من الموديل
def chat_with_model(history, message):
    conversation = ""
    for human, bot in history:
        conversation += f"User: {human}\nAssistant: {bot}\n"
    conversation += f"User: {message}\nAssistant:"

    response = llm(conversation, max_tokens=200)
    answer = response["choices"][0]["text"].strip()

    history.append((message, answer))
    return history, ""

# واجهة Chatbot
with gr.Blocks() as demo:
    gr.Markdown("## 🤖 Alnabil AI Chatbot\nتحدث مع موديل الذكاء الاصطناعي الخاص بك مباشرة من Hugging Face.")

    chatbot = gr.Chatbot(height=400)
    msg = gr.Textbox(placeholder="اكتب رسالتك هنا...")
    clear = gr.Button("مسح المحادثة")

    state = gr.State([])

    msg.submit(chat_with_model, [state, msg], [chatbot, msg])
    clear.click(lambda: ([], ""), None, [chatbot, msg])

# تشغيل على Railway
demo.launch(server_name="0.0.0.0", server_port=8080)
