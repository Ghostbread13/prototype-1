// بيانات مشروعك على Supabase// بيانات مشروعك على Supabase
const SUPABASE_URL = 'https://fktettiegkmaijnokrwr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_lZ6v_qG8aYXpwLY8VxPNfA_BfT87Jsh';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.handleLogin = async function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('error-msg');

    if (!email || !password) {
        errorDiv.textContent = "الرجاء إدخال البريد وكلمة المرور";
        return;
    }

    errorDiv.textContent = "جاري التحقق من البيانات...";

    try {
        // 1. تسجيل الدخول عبر Supabase Auth
        const { data: authData, error: authError } = await db.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (authError) {
            errorDiv.textContent = "خطأ في البريد أو كلمة المرور: " + authError.message;
            return;
        }

        // 2. التحقق من جدول users وجلب الصلاحية
        const { data: userData, error: userError } = await db
            .from('users')
            .select('role')
            .eq('email', email)
            .maybeSingle();

        if (userError || !userData) {
            errorDiv.textContent = "تم الدخول، لكن البريد غير مسجل في جدول الصلاحيات (users)!";
            return;
        }

        // 3. توجيه المستخدم حسب دوره
        const role = userData.role;
       if (role === 'admin') {
    window.location.href = 'admin.html';

        } else if (role === 'boss') {
         
          window.location.href = 'investor.html';
        } else if (role === 'worker') {
            alert("مرحباً بك أيها العامل (Worker)");
        } else {
            alert("مرحباً، صلاحيتك هي: " + role);
        }

    } catch (err) {
        errorDiv.textContent = "حدث خطأ غير متوقع: " + err.message;
    }
};