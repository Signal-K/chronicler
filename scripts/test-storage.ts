import { supabase } from '../lib/supabase.js';

/**
 * Test script to verify Supabase storage bucket access
 * Run with: npx ts-node scripts/test-storage.ts
 */
async function testStorageAccess() {
  console.log('🔍 Testing Supabase storage access...');
  
  try {
    // Test 1: List files in bucket
    console.log('\n📁 Testing bucket listing...');
    const { data: files, error: listError } = await supabase.storage
      .from('bumble')
      .list('', { limit: 5 });
    
    if (listError) {
      console.error('❌ List error:', listError);
    } else {
      console.log(`✅ Found ${files?.length || 0} files`);
      files?.slice(0, 3).forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size} bytes)`);
      });
    }
    
    // Test 2: Try to get a public URL
    if (files && files.length > 0) {
      const testFile = files[0];
      console.log(`\n🔗 Testing public URL generation for: ${testFile.name}`);
      
      const { data: urlData } = supabase.storage
        .from('bumble')
        .getPublicUrl(testFile.name);
      
      if (urlData?.publicUrl) {
        console.log('✅ Public URL generated:', urlData.publicUrl);
        
        // Test 3: Try to fetch the URL
        console.log('\n🌐 Testing URL accessibility...');
        try {
          const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
          console.log(`${response.ok ? '✅' : '❌'} HTTP Status: ${response.status}`);
        } catch (fetchError) {
          console.error('❌ Fetch error:', fetchError);
        }
      } else {
        console.error('❌ Failed to generate public URL');
      }
    }
    
    // Test 4: Test anomalies table access
    console.log('\n📊 Testing anomalies table access...');
    const { data: anomalies, error: anomalyError } = await supabase
      .from('anomalies')
      .select('id, anomalytype')
      .eq('anomalytype', 'bumble')
      .limit(3);
    
    if (anomalyError) {
      console.error('❌ Anomalies error:', anomalyError);
    } else {
      console.log(`✅ Found ${anomalies?.length || 0} bumble anomalies`);
      anomalies?.forEach(anomaly => {
        console.log(`   - ID: ${anomaly.id}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testStorageAccess();